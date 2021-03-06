'use strict'

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize

  const ProjectServer = app.model.define('project_server', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    project: INTEGER,
    environment: STRING(20),
    server: INTEGER,
    output: STRING(),
    changelog: INTEGER,
    createdTime: DATE,
    updatedTime: DATE
  })

  ProjectServer.associate = function () {
    app.model.ProjectServer.belongsTo(app.model.Server, { foreignKey: 'server', as: 'Server' })
  }

  return ProjectServer
}
