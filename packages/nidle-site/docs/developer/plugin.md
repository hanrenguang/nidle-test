---
id: plugin
sidebar_position: 3
---

# 插件开发
## 编写插件
Nidle的任务是通过插件去执行的，可以通过编写插件扩展自己的自动化部署流程。

## 创建插件
一个插件由以下构成

* 一个具名 JavaScript 函数。
* 在它的原型上定义 apply 方法。
* 在 apply 方法中往调度器 add、addParallel(挂载) 任务处理方法。
* 方法是个 Promise 对象，内部通过 task 实例可以获取到 构建相关内容，并可进行相应操作。
* 在实现功能后结束 Promise。

```javascript
class ExamplePlugin {
  apply (scheduler) {
    // 串行任务
    scheduler.add('name', (task, config) => {
      return new Promise((reject, resolve) => {
        // ...  
      })
    })

    // 并行任务
    scheduler.addParallel('name', (task, config) => {
      return new Promise((reject, resolve) => {
        // ...  
      })
    })
  }

  input () {
    // inquirer question list
    return [
      {
        type: 'input',
        name: 'test',
        message: 'xxx'
      }
    ]
  }
}
```

### add 挂载说明
* `add(name, callback)` - 添加串行方法，任务默认都是串行执行的
* `addParallel(name, callback)` - 添加并行方法，当任务是完全独立并确认不会影响到后续流程时(如 图片压缩)，那么可以进行并行处理，以优化构建效率

:::note
串行和并行方法内部实现是一致的，所以内部是可以混用；当任务阶段关闭并行执行时，系统会提示一个 warning 提示，将并行方法进行串行执行
:::

### input说明
input输入需要同时支持 `CLI` 和 `SPA` 端，所以我们进行了以下技术选型：
* `CLI端` - 基于强大的 [inquirer](https://www.npmjs.com/package/inquirer) 交互式命令行
* `SPA端` - 基于阿里的 [XRender](https://x-render.gitee.io/form-render) 配置化表单生成方案

为了同一配置支持两端，我们做了以下取舍
* `inquirer`的输入类型相对于 `form` 少，为了减少适配成本，所以优先考虑支持 `inquirer`
* 在 `SPA端` 我们需要对 `inquirer question` 进行一次转换，转换成 `schema`
* 因为每个插件都可能有 `input`，输入的时候需要进行分组，所以
  * `inquirer` 需要在 `question name` = `${plugin.name}-${question.name}`
  * `SPA端` 需要对输入项进行分组