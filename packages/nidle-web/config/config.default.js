'use strict'

require('../.dotenv.js')

const {
  DB_USER,
  DB_PASS,
  DB_HOST,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_DB_INDEX,
  OAUTH_GITLAB_BASEURL,
  GITLAB_PRIVATE_TOKEN
} = process.env

module.exports = appInfo => {
  // eslint-disable-next-line node/no-exports-assign
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}'

  // add your config here
  config.middleware = []

  // change to your own sequelize configurations
  config.sequelize = {
    dialect: 'mysql',
    host: DB_HOST,
    port: 3306,
    database: 'nidle_web',
    username: DB_USER,
    password: DB_PASS,
    timezone: '+08:00',
    // query: { raw: true },
    define: {
      timestamps: true,
      freezeTableName: true,
      createdAt: 'createdTime',
      updatedAt: 'updatedTime'
    }
  }

  config.view = {
    mapping: {
      '.nj': 'nunjucks'
    }
  }

  config.session = {
    key: 'NIDLE_SESSION',
    maxAge: 7 * 24 * 3600 * 1000,
    httpOnly: true,
    encrypt: true
  }

  config.redis = {
    client: {
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
      db: REDIS_DB_INDEX
    },
    agent: true
  }

  // node gitlab api
  config.gitlab = {
    api: `${OAUTH_GITLAB_BASEURL}/api/v4`,
    privateToken: GITLAB_PRIVATE_TOKEN
  }

  config.security = {
    csrf: {
      ignore: '/api/changelog/mergeHook'
    }
  }

  return config
}
