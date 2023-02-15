import {Service} from "koishi";
import {JSONPath} from 'jsonpath-plus';
import {Time} from "koishi"
import {PluginManager} from "./plugin";

declare module "koishi"{
  interface Context{
    blockly:BlocklyService
  }
}

export class BlocklyService extends Service{

  manager : PluginManager

  constructor(ctx) {
    super(ctx,'blockly');
    this.manager = new PluginManager(ctx)
  }
  async json_parse(v,t){
    try {
      return await JSONPath({path:t,json:v})
    }catch(e){
      this.ctx.logger('blockly-lib').warn("Failed to read the object:"+e.toString())
      return undefined
    }
  }

  async date_format(t, f){
    return Time.template(f,t)
  }

  async reload(restart?:boolean){
    if(restart){
      this.manager.plugins = (await this.ctx.database.get('blockly',{enabled:true},["code","enabled"]))
        .filter(t=>t.enabled).map(t=>t.code)
      this.manager.restart()
    }
    if(this.ctx['console.blockly']){
      await this.ctx['console.blockly'].refresh()
    }
  }
}
