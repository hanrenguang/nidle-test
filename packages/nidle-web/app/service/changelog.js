'use strict'

// 发布记录
const fs = require('fs')
const path = require('path')
const Service = require('egg').Service
const Nidle = require('nidle')
const _ = require('lodash')
const extend = require('extend')
const moment = require('moment')

class ChangelogService extends Service {
  // 新建发布，发布周期继续发布、重新发布
  async create() {
    const { ctx } = this
    const nidleConfig = ctx.app.config.nidle
    // id是非必须的，只有在发布周期创建新的发布记录才传
    const { id, branch, projectId, mode, source = 'web' } = ctx.request.body

    try {
      const now = new Date().getTime()
      // 发布周期
      let period = now
      const project = await ctx.service.project.getBaseinfo(projectId)
      let commitId

      if (mode === nidleConfig.environments[0].value) {
        const branchInfo = await ctx.service.gitlab.getBranch(project.gitlabId, branch)
        commitId = branchInfo.commit.id
      }

      let options = {
        repository: {
          type: project.repositoryType.toLocaleLowerCase(),
          url: project.repositoryUrl,
          id: project.gitlabId,
          branch,
          commitId,
          userName: ctx.session.user.name
        }
      }

      if (id) {
        // 现有发布记录上创建，复用period
        const changelog = await ctx.model.Changelog.findOne({ where: { id } })
        period = changelog.period
        commitId = changelog.commitId

        // 复用source、output
        const configRaw = fs.readFileSync(changelog.configPath)
        const config = JSON.parse(configRaw)

        options = {
          ...options,
          source: config.source,
          output: config.output
        }

        // 解除环境占用
        await ctx.service.projectServer.cancelUsed(id)
      }

      const fileName = `${project.name}_${now}`
      const createConfig = await ctx.service.config.getByCreate(project, mode, commitId, fileName, options)
      const config = {
        ...options,
        ...createConfig
      }
      let initConfig = {}

      if (createConfig) {
        const manager = new Nidle(extend(true, {}, config))
        initConfig = await manager.init()
      }

      // 将配置存起来
      const configPath = path.resolve(nidleConfig.config.path, `${mode}_${fileName}.json`)
      fs.writeFileSync(
        configPath,
        JSON.stringify(
          {
            ...config,
            inputs: initConfig.inputs || []
          },
          '',
          2
        )
      )

      // 创建记录
      const changelog = await ctx.model.Changelog.create({
        period,
        project: projectId,
        branch,
        developer: ctx.session.user.id,
        source,
        status: createConfig ? 'NEW' : 'SUCCESS',
        codeReviewStatus: 'NEW',
        environment: mode,
        configPath,
        logPath: createConfig ? config.log.all : null,
        active: 0,
        commitId: commitId
      })
      const next = ctx.helper.nidleNext(changelog)
      initConfig.inputs = await ctx.service.config.getInput(initConfig.inputs, initConfig.inputs, source)

      if (id) {
        // 将原记录设为已禁用
        await ctx.model.Changelog.update(
          {
            active: 1
          },
          { where: { id } }
        )
      }

      return {
        config,
        changelog,
        ...initConfig,
        next
      }
    } catch (err) {
      ctx.logger.error(`新建发布: \n${err.message}\n${err.stack}`)
      throw err
    }
  }

  // 开始构建任务
  async start({ id, configPath, inputs = [], options: inputAnswers }) {
    const { ctx } = this

    try {
      const answers = inputs.length ? await ctx.service.config.setInput(inputAnswers, inputs) : {}
      const configRaw = fs.readFileSync(configPath)
      const config = JSON.parse(configRaw)
      const options = _.cloneDeep(answers)

      for (let i = 0, len = answers.length; i < len; i++) {
        const step = answers[i]

        if (step._serversKey) {
          const serverList = []

          for (let j = 0, slen = step.options[step._serversKey].length; j < slen; j++) {
            const item = step.options[step._serversKey][j]
            const server = await ctx.model.Server.findOne({ where: { id: item.serverId } })
            await ctx.model.ProjectServer.update({ changelog: id }, { where: { id: item.id } })

            serverList.push({
              id: item.id,
              output: item.output,
              ip: server.ip,
              username: server.username,
              password: server.password
            })
          }

          options[i].options[step._serversKey] = serverList

          step.options[step._serversKey] = serverList.map(item => {
            return {
              id: item.id,
              ip: item.ip,
              output: item.output
            }
          })
          delete step._serversKey
        }
      }

      fs.writeFileSync(
        configPath,
        JSON.stringify(
          {
            ...config,
            options: answers
          },
          '',
          2
        )
      )

      ctx.app.runInBackground(async ctx => {
        async function update(data) {
          try {
            await ctx.model.Changelog.update(data, { where: { id } })
          } catch (err) {
            throw err
          }
        }

        const manager = new Nidle({
          ...config
        })
        await manager.init()
        await manager.mount(options, update)

        async function wait() {
          return new Promise(resolve => {
            manager.on('completed', function () {
              console.log('completed')
              resolve()
            })

            manager.on('error', function () {
              console.log('end')
              resolve()
            })
          })
        }
        await manager.start()
        await wait()
      })

      await ctx.model.Changelog.update(
        {
          status: 'PENDING'
        },
        { where: { id } }
      )

      return true
    } catch (err) {
      ctx.logger.error(`开始构建: \n${err.message}\n${err.stack}`)
      throw err
    }
  }

  // 退出发布
  async quit() {
    const { ctx } = this
    const { id } = ctx.request.body

    try {
      // 解除环境占用
      await ctx.service.projectServer.cancelUsed(id)
      await ctx.model.Changelog.update(
        {
          status: 'CANCEL'
        },
        { where: { id } }
      )

      return true
    } catch (err) {
      ctx.logger.error(`退出发布: \n${err.message}\n${err.stack}`)
      throw err
    }
  }

  // 任务详情
  async detail({ id }) {
    const { ctx } = this
    try {
      const changelog = await ctx.model.Changelog.findOne({ where: { id } })

      if (changelog) {
        const next = ctx.helper.nidleNext(changelog)
        const project = await ctx.model.Project.findOne({ where: { id: changelog.project } })
        const configRaw = fs.readFileSync(changelog.configPath)
        const config = JSON.parse(configRaw)
        const inputs = await ctx.service.config.getInput(config.inputs, config.options || config.inputs)

        return {
          config,
          changelog: {
            ...changelog.dataValues,
            statusEnum: changelog.statusEnum,
            projectName: project.name
          },
          inputs,
          next
        }
      } else {
        throw new Error('未找到相关发布记录')
      }
    } catch (err) {
      ctx.logger.error(`发布记录详情: \n${err.message}\n${err.stack}`)
      throw err
    }
  }

  // 日志
  async log({ logPath, id, type = 'all' }) {
    const { ctx } = this

    try {
      const changelog = await ctx.model.Changelog.findOne({ where: { id } })
      const next = ctx.helper.nidleNext(changelog)
      let logRaw

      if (!logPath) {
        if (type === 'error') {
          // 只返回错误日志
          const configRaw = fs.readFileSync(changelog.configPath)
          const config = JSON.parse(configRaw)

          logPath = config.log.error
        } else {
          logPath = changelog.logPath
        }
      }

      logRaw = fs.readFileSync(logPath)
      logRaw = logRaw.toString().replace(/\n/g, ',')

      if (logRaw[logRaw.length - 1] === ',') {
        logRaw = logRaw.substr(0, logRaw.length - 1)
      }

      logRaw = '[' + logRaw + ']'
      const logs = JSON.parse(logRaw)
      const len = logs.length

      const result = {
        status: changelog.status,
        statusEnum: changelog.statusEnum,
        stage: changelog.stage,
        next
      }

      if (len > 1) {
        result.startTime = logs[0].time

        if (changelog.statusEnum > 1) {
          result.endTime = logs[len - 1].time
        }

        result.duration = getDuration(logs[0].time, logs[len - 1].time)

        // 分组
        const stages = []
        transform(logs, stages, 0)

        return {
          ...result,
          stages
        }
      } else {
        return result
      }
    } catch (err) {
      ctx.logger.error(`发布记录日志: \n${err.message}\n${err.stack}`)
      throw err
    }
  }
}

function transform(logs, stages, from = 0) {
  const stageStartIdx = _.findIndex(logs, { progress: 'STAGE START' }, from)

  if (stageStartIdx > -1) {
    const stageStart = logs[stageStartIdx]
    const stage = {
      name: stageStart.name,
      startTime: stageStart.time,
      steps: []
    }

    const stageEndIdx = _.findIndex(
      logs,
      function (item) {
        return (item.progress === 'STAGE ERROR' || item.progress === 'STAGE COMPLETE') && item.name === stage.name
      },
      stageStartIdx
    )
    getSteps(logs, stage.steps, stageStartIdx, stageEndIdx > -1 ? stageEndIdx : logs.length)

    stages.push(stage)

    if (stageEndIdx > -1) {
      const stageEnd = logs[stageEndIdx]
      stage.endTime = stageEnd.time
      stage.duration = getDuration(stage.startTime, stage.endTime)

      transform(logs, stages, stageEndIdx)
    } else {
      stage.duration = getDuration(stage.startTime, logs[logs.length - 1].time)
      return
    }
  } else {
    return
  }
}

function getSteps(logs, steps, from = 0, end) {
  const stepStartIdx = _.findIndex(logs, { progress: 'STEP START' }, from)

  if (stepStartIdx > -1) {
    const stepStart = logs[stepStartIdx]
    const step = {
      name: stepStart.name,
      taskName: stepStart.taskName,
      startTime: stepStart.time
    }

    const stepEndIdx = _.findIndex(
      logs,
      function (item) {
        return (item.progress === 'STEP ERROR' || item.progress === 'STEP COMPLETE') && item.name === step.name
      },
      stepStartIdx
    )

    // 拼接详情
    const list = logs.slice(stepStartIdx + 1, stepStartIdx > -1 ? stepEndIdx : logs.len)
    step.detail = list.map(item => item.detail).join('')

    steps.push(step)

    if (stepEndIdx > -1) {
      const stepEnd = logs[stepEndIdx]
      step.endTime = stepEnd.time
      step.duration = getDuration(step.startTime, step.endTime)

      if (stepEnd.progress === 'STEP ERROR') {
        step.status = 'FAIL'
        step.detail += stepEnd.error.stack
      }

      if (stepEndIdx + 1 >= end) {
        return
      }

      getSteps(logs, steps, stepEndIdx, end)
    } else {
      step.duration = getDuration(step.startTime, logs[logs.length - 1].time)
      return
    }
  } else {
    return
  }
}

// 计算持续时间
function getDuration(begin, end) {
  const beginTime = moment(begin)
  const endTime = moment(end)
  const duration = moment.duration(endTime.diff(beginTime))
  const m = duration.minutes()
  const s = duration.seconds()

  return m ? `${m}m${s}s` : s === 0 ? '<1s' : `${s}s`
}

module.exports = ChangelogService