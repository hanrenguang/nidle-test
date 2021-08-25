/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],
  document: [
    {
      type: 'autogenerated',
      // label: '文档',
      dirName: 'document', // '.' 指的是当前的 docs 目录（也就是存放文档的根目录）
    }
  ],
  developer: [
    {
      type: 'autogenerated',
      // label: '开发',
      dirName: 'developer', // '.' 指的是当前的 docs 目录（也就是存放文档的根目录）
    }
  ]

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
};