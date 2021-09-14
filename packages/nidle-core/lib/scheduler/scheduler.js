import PQueue from 'p-queue'
import pTimeout from 'p-timeout'
import StageQueue from './stage-queue.js'
import EventEmitter from 'eventemitter3'

// 插件挂载处理
class Mounter extends EventEmitter {
  constructor (task, stages) {
    super()

    this.task = task
    this.logger = task.logger
    this.stages = stages
    this._stages = []
    this.queue = null
    this._isError = false
    this.EE = new EventEmitter()
  }

  mount () {
    this.queue = new PQueue({
      concurrency: 1,
      autoStart: false,
      queueClass: StageQueue
    })

    this._bind()
  }

  _bind () {
    const { queue, logger } = this

    queue.on('active', () => {
      const stage = queue._queue.current
      logger.info({
        progress: 'STAGE START',
        name: stage.name
      })

      // TODO: 状态
    })

    queue.on('completed', () => {
      const stage = queue._queue.current
      logger.info({
        progress: 'STAGE COMPLETE',
        name: stage.name
      })

      // TODO: 备份、状态等操作
      // TODO: stage complete
      if (this._stages.length) {
        this._add()
      }
    })

    queue.on('idle', () => {
      if (!this._stages.length) {
        this.emit('completed')
      }
    })

    queue.on('error', error => {
      const stage = queue._queue.current
      logger.warn({
        progress: 'STAGE ERROR',
        name: stage.name,
        error
      })

      this._isError = true
      queue._queue.onFailed()

      // 清除运行队列
      if (queue._queue.child) {
        queue.par
        queue._queue.child.clear()
      }
      queue.clear()
      this.EE.removeListener('error')
      this.EE.removeListener('completed')
      // TODO: 状态
      this.emit('error', error)
    })
  }

  _add () {
    const { task, _stages, queue, _isError, EE, logger } = this

    if (_isError) {
      return false
    }

    const stage = _stages.shift()
    logger.info({
      progress: 'STAGE ADD',
      name: stage.name
    })

    let run = () => {
      return new Promise((resolve, reject) => {
        // 阶段步骤开始
        queue._queue.child.start()

        EE.on('error', error => {
          reject(error)
        })

        EE.on('completed', () => {
          resolve()
        })
      })
    }

    if (stage.timeout) {
      run = timeoutRun.call(this, run, stage)
    }

    queue.add(run, {
      task,
      stage,
      event: EE,
      logger
    }).catch(error => {
      // 如果不catch错误，在任务中throw错误会导致jest报错
      console.error('scheduler error', error)
    })
  }

  // 指定开始步骤
  start (start = 0) {
    this._stages = this.stages.slice(start)
    this._add()
    this.queue.start()
  }
}

function timeoutRun (run, stage) {
  return () => {
    return pTimeout(run(), stage.timeout, () => {
      throw new Error(`${stage.name}任务超时: ${stage.timeout}`)
    })
  }
}

export default Mounter