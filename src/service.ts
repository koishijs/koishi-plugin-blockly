import {Service,Dict} from "koishi";
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
