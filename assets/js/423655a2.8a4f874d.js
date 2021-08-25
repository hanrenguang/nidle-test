"use strict";(self.webpackChunknidle_site=self.webpackChunknidle_site||[]).push([[393],{9307:function(n,e,t){t.r(e),t.d(e,{frontMatter:function(){return l},contentTitle:function(){return r},metadata:function(){return s},toc:function(){return u},default:function(){return d}});var i=t(7896),o=t(1461),a=(t(2784),t(876)),p=["components"],l={id:"config",title:"\u914d\u7f6e",sidebar_position:2},r=void 0,s={unversionedId:"developer/config",id:"developer/config",isDocsHomePage:!1,title:"\u914d\u7f6e",description:"\u4efb\u52a1\u914d\u7f6e\u8bf4\u660e",source:"@site/docs/developer/config.md",sourceDirName:"developer",slug:"/developer/config",permalink:"/nidle/docs/developer/config",editUrl:"https://github.com/yanuoda/nidle/edit/main/packages/nidle-site/docs/developer/config.md",version:"current",sidebarPosition:2,frontMatter:{id:"config",title:"\u914d\u7f6e",sidebar_position:2},sidebar:"developer",previous:{title:"\u67b6\u6784\u8bbe\u8ba1",permalink:"/nidle/docs/developer/design"},next:{title:"\u63d2\u4ef6\u5f00\u53d1",permalink:"/nidle/docs/developer/plugin"}},u=[{value:"\u4efb\u52a1\u914d\u7f6e\u8bf4\u660e",id:"\u4efb\u52a1\u914d\u7f6e\u8bf4\u660e",children:[{value:"\u7ed9\u4efb\u52a1\u5668\u7684\u6700\u7ec8\u914d\u7f6e",id:"\u7ed9\u4efb\u52a1\u5668\u7684\u6700\u7ec8\u914d\u7f6e",children:[]},{value:"\u6a21\u677f\u914d\u7f6e",id:"\u6a21\u677f\u914d\u7f6e",children:[]},{value:"\u5e94\u7528\u914d\u7f6e",id:"\u5e94\u7528\u914d\u7f6e",children:[]}]}],c={toc:u};function d(n){var e=n.components,t=(0,o.Z)(n,p);return(0,a.kt)("wrapper",(0,i.Z)({},c,t,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"\u4efb\u52a1\u914d\u7f6e\u8bf4\u660e"},"\u4efb\u52a1\u914d\u7f6e\u8bf4\u660e"),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"\u8be6\u7ec6\u8bf4\u660e\u4efb\u52a1\u914d\u7f6e\u7684\u7ee7\u627f\u3001\u6269\u5c55\u673a\u5236\uff08\u5185\u7f6e\u6a21\u677f > \u56e2\u961f\u6a21\u677f > \u5e94\u7528\u914d\u7f6e\uff09")),(0,a.kt)("h3",{id:"\u7ed9\u4efb\u52a1\u5668\u7684\u6700\u7ec8\u914d\u7f6e"},"\u7ed9\u4efb\u52a1\u5668\u7684\u6700\u7ec8\u914d\u7f6e"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},"// \u7ed9\u4efb\u52a1\u5668\u7684\u6700\u7ec8\u914d\u7f6e\nmodule.exports = {\n  name: 'app-name', // \u5e94\u7528\u540d\u79f0\n  repository: {\n    // \u4ecepackage.json \u548c git\u4fe1\u606f\u83b7\u53d6\n    type: 'git',\n    url: 'http://xxx.xxx.com/xx/xx.git',\n    branch: 'dev',\n    userName: ''\n  },\n  type: 'publish', // \u4efb\u52a1\u7c7b\u578b: build/test/publish\n  // \u65e5\u5fd7\n  log: {\n    path: '/xx/xx/', // \u65e5\u5fd7\u5b58\u653e\u8def\u5f84\n    fullFileName: 'full.log', // \u5168\u91cf\u65e5\u5fd7\n    errorFileName: 'error.log', // \u5f02\u5e38\u65e5\u5fd7\n  },\n  // \u8f93\u51fa\u3001\u5907\u4efd\n  output: {\n    backup: {\n      path: '/xx/xx',\n      maxCount: 3, // \u5907\u4efd\u6700\u5927\u6570\u91cf\n    },\n    cache: {\n      // \u53d1\u5e03\u8bb0\u5f55\u7f13\u5b58\uff0c\u7528\u6765\u90e8\u7f72\u548c\u5931\u8d25\u91cd\u8bd5\n      path: '/xx/xx' \n    },\n    path: ''\n  },\n  // \u63d2\u4ef6input\n  input: [\n    {\n      plugin: '', // \u63d2\u4ef6\u540d\u79f0\n      options: {\n        // \u63d2\u4ef6\u8981\u6c42\u8f93\u5165\u9879\uff0c\u53c2\u8003inquirer\n        mode: '', // \u53d1\u5e03\u73af\u5883: development/pre/production\n        server: [\n          {\n            host: '10.70.70.140',\n            user: 'root',\n            password: 'xxx',\n            output: '/xxx/xxx'\n          }\n        ]\n      }\n    }\n  ],\n  stages: [\n    {\n      name: 'build',\n      timeout: 0, // \u8d85\u65f6\u7ed3\u675f\uff0c0\u5219\u4e0d\u8d85\u65f6\n      steps: [\n        {\n          name: '',\n          enable: true, // \u63d2\u4ef6\u5f00\u542f\u4e0e\u5426\n          package: 'example-plugin', // npm \u6a21\u5757\u540d\n          path: './plugins/example-plugin.js', // \u4e0e package \u914d\u7f6e\u4e92\u65a5\uff0c\u4f18\u5148\u53d6 package,\n          timeout: 0, // \u8d85\u65f6\u7ed3\u675f\uff0c0\u5219\u4e0d\u8d85\u65f6\n          retry: 0, // \u5931\u8d25\u91cd\u8bd5\uff0c0\u5219\u4e0d\u91cd\u8bd5\n          options: {\n            // \u63d2\u4ef6\u9ed8\u8ba4\u914d\u7f6e\uff0c\u6700\u540e\u4f1a\u8ddfinput\u6574\u5408\uff0cinput\u4f18\u5148\n          }\n        }\n      ]\n    }\n  ]\n}\n\n\n")),(0,a.kt)("h3",{id:"\u6a21\u677f\u914d\u7f6e"},"\u6a21\u677f\u914d\u7f6e"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},"// \u6a21\u677f\u914d\u7f6e\nmodule.exports = {\n  name: '', // \u6a21\u677f\u540d\u79f0\n  type: 'publish', // \u4efb\u52a1\u7c7b\u578b: build/test/publish\n  // \u65e5\u5fd7\n  log: {\n    path: '/xx/xx/', // \u65e5\u5fd7\u5b58\u653e\u8def\u5f84\n    fullFileName: 'full.log', // \u5168\u91cf\u65e5\u5fd7\n    errorFileName: 'error.log', // \u5f02\u5e38\u65e5\u5fd7\n  },\n  // \u8f93\u51fa\u3001\u5907\u4efd\n  output: {\n    backup: {\n      path: '/xx/xx',\n      maxCount: 3, // \u5907\u4efd\u6700\u5927\u6570\u91cf\n    },\n    cache: {\n      // \u53d1\u5e03\u8bb0\u5f55\u7f13\u5b58\uff0c\u7528\u6765\u90e8\u7f72\u548c\u5931\u8d25\u91cd\u8bd5\n      path: '/xx/xx' \n    }\n  },\n  stages: [\n    {\n      name: 'build',\n      timeout: 0, // \u8d85\u65f6\u7ed3\u675f\uff0c0\u5219\u4e0d\u8d85\u65f6\n      disabledParallel: false, // \u662f\u5426\u5173\u95ed\u5e76\u884c\u63d2\u4ef6\uff0c\u5173\u95ed\u540e\u5e76\u884c\u63d2\u4ef6\u4f1a\u53d8\u6210\u987a\u5e8f\u6267\u884c\n      steps: [\n        {\n          name: '',\n          enable: true, // \u63d2\u4ef6\u5f00\u542f\u4e0e\u5426\n          package: 'example-plugin', // npm \u6a21\u5757\u540d\n          path: './plugins/example-plugin.js', // \u4e0e package \u914d\u7f6e\u4e92\u65a5\uff0c\u4f18\u5148\u53d6 package,\n          timeout: 0, // \u8d85\u65f6\u7ed3\u675f\uff0c0\u5219\u4e0d\u8d85\u65f6\n          retry: 0, // \u5931\u8d25\u91cd\u8bd5\uff0c0\u5219\u4e0d\u91cd\u8bd5\n          options: {\n            // \u63d2\u4ef6\u9ed8\u8ba4\u914d\u7f6e\uff0c\u6700\u540e\u4f1a\u8ddfinput\u6574\u5408\uff0cinput\u4f18\u5148\n          }\n        }\n      ]\n    }\n  ]\n}\n")),(0,a.kt)("h3",{id:"\u5e94\u7528\u914d\u7f6e"},"\u5e94\u7528\u914d\u7f6e"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},"// \u5e94\u7528\u914d\u7f6e\nmodule.exports = {\n  name: '\u5e94\u7528\u540d\u79f0',\n  extend: '', // \u6a21\u5757\u6269\u5c55\n  log: {},\n  output: {},\n  stages: [], // \u4e0d\u6269\u5c55\u7684\u60c5\u51b5\u53ef\u4ee5\u914d\n  chain: (config) => {\n    // \u53ef\u4ee5\u50cf\u6570\u7ec4\u4e00\u6837\u79fb\u9664\uff0c\u65b0\u589e\n    config.stages.push({})\n    // \u4fee\u6539\u6307\u5b9astage\u7684\u914d\u7f6e\n    config.stage('xxx').set('timeout', 0)\n\n    // \u53ef\u4ee5\u50cf\u6570\u636e\u4e00\u6837\u79fb\u9664\u3001\u65b0\u589e\u6307\u5b9astage\u7684steps\n    config.stage('xxx').steps.push({})\n    // \u4fee\u6539\u6307\u5b9astep\u7684\u914d\u7f6e\n    config.stage('xxx').step('xxx').set('timeout', 0)\n    config.stage('xxx').step('xxx').options({})\n  }\n}\n")))}d.isMDXComponent=!0}}]);