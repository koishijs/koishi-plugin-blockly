import {} from 'koishi-plugin-blockly'
import { Context } from '@koishijs/client'
import Page from './page.vue'

import './index.scss'

export default (ctx: Context) => {
  ctx.page({
    name: 'Blockly 可视化编程',
    path: '/blockly',
    authority: 5,
    component: Page,
    fields:['blockly']
  })
}
