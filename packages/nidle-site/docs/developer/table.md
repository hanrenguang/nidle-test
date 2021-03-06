---
id: table
title: 数据库
sidebar_position: 4
---

## 数据库表
### plugin 插件表
* id: uniqueid
* name: string
* description: string
* package: string
* version: string
* installStatus: int - 0: 安装中 1: 安装成功 2: 安装失败
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### template 配置模板表
* id: uniqueid
* name: string
* description: string
* config: text
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### server 服务器表
* id: uniqueid
* name: string
* ip: string
* description: string
* environment: string
* username: string
* password: string
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### role 角色表
默认有admin和developer角色
* id: uniqueid
* name: string
* code: string
* description: string
* permision: text - 菜单权限list
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### member 用户表
* id: uniqueid
* login: string
* name: string
* password: password
* role: roleId
* gitlabUserId: number - gitlab 用户 id
* status: int - 0: 禁用 1: 启用
* createdTime: date-time
* updatedTime: date-time

### project 应用表
* id: uniqueid
* name: string
* description: string
* owner: string
* repositoryType: string - 默认GIT
* repositoryUrl: string
* postEmails: string - 邮件通知列表
* gitlabId: number - gitlab 项目 id
* createdTime: date-time
* updatedTime: date-time

### project-member 应用用户表（已删除）
* id: uniqueid
* project: projectId
* member: memberId
* role: string
* createdTime: date-time
* updatedTime: date-time

### project-server 应用服务表
* id: uniqueid
* project: projectId
* environment: string
* server: serverId
* output: string
* changelog: uniqueid - 标识服务被哪个构建记录占用
* createdTime: date-time
* updatedTime: date-time

### changelog 构建表（每次构建都会新增记录）
* id: uniqueid
* period: string 发布周期ID，用来聚合同一周期发布
* project: projectId
* branch: string
* commitId: string
* developer: memberId
* source: string - 触发方式: CLI、webhook、web
* status: enum - ['NEW', 'PENDING', 'SUCCESS', 'FAIL', 'CANCEL']\
这里不再保留`unstable`状态，因为也无法区别哪里出问题，而是再前台根据`log.warn`判断存在警告，可能不稳定来标识
* codeReviewStatus: enum - ['NEW', 'PENDING', 'SUCCESS', 'FAIL']
* environment: string - 发布环境
* stage: string
* duration: number - 持续时间
* configPath: string - 配置数据路径（input数据、日志路径都从这个文件拿）
* logPath: string - 日志路径
* active: number - 0: 启用，1: 禁用（当在该记录上创建新记录后，该记录将结束，被禁用）
* createdTime: date-time
* updatedTime: date-time 
