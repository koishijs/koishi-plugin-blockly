import {} from 'koishi-plugin-blockly'
import { Context, icons } from '@koishijs/client'
import Page from './index.vue'
import Activity from './icons/activity.vue'

icons.register('blockly', Activity)

import './index.scss'

export default (ctx: Context) => {
  ctx.page({
    name: 'Blockly 可视化编程',
    path: '/blockly',
    icon: 'blockly',
    authority: 5,
    component: Page,
    fields:['blockly']
  })
}
