'use strict'

const Service = require('egg').Service

const { OAUTH_GITLAB_BASEURL, GITLAB_PRIVATE_TOKEN } = process.env
const accessLevelMap = {
  10: 'Guest',
  20: 'Reporter',
  30: 'Developer',
  40: 'Maintainer',
  50: 'Owner'
}

class GitlabService extends Service {
  /**
   * gitlab 请求封装
   */
  async gitlabRequest(options) {
    const { url, method, params, headers, ...rest } = options
    return this.ctx.curl(`${OAUTH_GITLAB_BASEURL}/api/v4${url}`, {
      method,
      data: params,
      headers: {
        'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN,
        ...headers
      },
      dataType: 'json',
      ...rest
    })
  }

  async getMembers(projectUrl) {
    const projectPath = projectUrl.replace(`${OAUTH_GITLAB_BASEURL}/`, '')
    const group = projectPath.split('/').length === 2 ? projectPath.split('/')[0] : null
    const id = encodeURIComponent(projectPath)
    let groupMembers = []

    const projectMembers = await this.gitlabRequest({
      url: `/projects/${id}/members`,
      method: 'GET'
    })

    if (group) {
      groupMembers = await this.gitlabRequest({
        url: `/groups/${group}/members`,
        method: 'GET'
      })
    }

    const members = [...(projectMembers?.data || []), ...(groupMembers?.data || [])].map(member => {
      return {
        role: accessLevelMap[member.access_level],
        ...member
      }
    })
    return members
  }
}

module.exports = GitlabService