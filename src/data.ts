import {DataService} from "@koishijs/plugin-console";
import {Context} from "koishi";
import {BlocklyMenuItem} from "./index";

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

export function initializeDatabase(ctx) {
  ctx.database.extend('blockly', {
    id: 'integer',
    name: 'string',
    body: 'text',
    code: 'text',
    enabled: 'boolean',
    edited: 'boolean'
  }, {
    autoInc: true
  })
}
