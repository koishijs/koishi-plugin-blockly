import { defineConfig } from '@koishijs/vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'koishi-plugin-blockly',
  description: 'Blockly 可视化编程插件',

  head: [
    ['link', { rel: 'icon', href: 'https://koishi.chat/logo.png' }],
    ['link', { rel: 'manifest', href: 'https://koishi.chat/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#5546a3' }],
  ],

  themeConfig: {
    nav: [{
      text: '指南',
      link: './',
    }, {
      text: '参考',
      link: './reference/',
    // }, {
    //   text: '扩展',
    //   link: './develop/',
    }, {
      text: '更多',
      items: [
        { text: 'Koishi 官网', link: 'https://koishi.chat' },
        { text: 'Koishi 论坛', link: 'https://forum.koishi.xyz' },
      ],
    }],

    sidebar: {
      '/develop/': [{
        items: [
          { text: '扩展', link: './develop/' },
        ],
      }],
      '/reference/': [{
        items: [
          { text: '总览', link: './reference/' },
        ],
      }, {
        text: '块',
        items: [
          { text: '逻辑', link: './reference/block/logical.md' },
          { text: '循环', link: './reference/block/loop.md' },
          { text: '数学', link: './reference/block/math.md' },
          { text: '文本', link: './reference/block/string.md' },
          { text: '列表', link: './reference/block/array.md' },
          { text: '变量', link: './reference/block/variable.md' },
          { text: '事件', link: './reference/block/event.md' },
          { text: '会话', link: './reference/block/session.md' },
          { text: '消息', link: './reference/block/message.md' },
          { text: '元素', link: './reference/block/element.md' },
          { text: '数据', link: './reference/block/data.md' },
          { text: '操作', link: './reference/block/bot.md' },
          { text: '调试', link: './reference/block/debug.md' },
        ],
      // }, {
      //   text: '流',
      //   items: [],
      }],
      '/': [{
        text: '指南',
        items: [
          { text: '介绍', link: './' },
          { text: '搭建', link: './starter.md' },
          { text: '用法', link: './usage.md' },
        ],
      }, {
        text: '示例',
        items: [
          { text: '你好，世界', link: './examples/hello-world.md' },
          { text: 'at 人功能', link: './examples/mention.md' },
          { text: '查询天气', link: './examples/weather.md' },
          { text: '指令参数', link: './examples/argument.md' },
          { text: '发送图片', link: './examples/image.md' },
          { text: '平台功能', link: './examples/platform.md' },
        ],
      }, {
        text: '更多',
        items: [
          { text: 'Koishi 官网', link: 'https://koishi.chat' },
          { text: 'Koishi 论坛', link: 'https://forum.koishi.xyz' },
        ],
      }],
    },
  },
})
