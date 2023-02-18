import {DataService} from "@koishijs/plugin-console";
import {Context} from "koishi";
import {BlocklyMenuItem} from "./index";
import {v4 as uuidV4} from 'uuid'

declare module '@koishijs/plugin-console' {
  namespace Console{
    interface Services {
      blockly: BlocklyProvider
    }
  }
}

export class BlocklyProvider extends DataService<BlocklyMenuItem[]> {
  constructor(ctx: Context) {
    super(ctx, 'blockly')
  }
  async get() {
    return (await this.ctx.database.get('blockly',{id:{$not:-1}},["id","name","enabled","edited"]))
  }
}

export async function initializeDatabase(ctx) {
  ctx.database.extend('blockly', {
    id: 'integer',
    name: 'string',
    body: 'text',
    code: 'text',
    enabled: 'boolean',
    edited: 'boolean',
    uuid: 'string'
  }, {
    autoInc: true
  })
  const blocks = await ctx.database.get('blockly', {id: {$not:-1}})
  const logger = ctx.logger('blockly')
  for(const block of blocks){
    if(!block.uuid){
      const uuid = uuidV4()
      logger.info(`block ${block.id} has no uuid ->  ${uuid}`)
      await ctx.database.set('blockly',block.id,{uuid})
    }
  }
}
