import {Context, ForkScope, Logger, segment} from "koishi";
import vm from "node:vm";
import {esModuleToCommonJs} from "./transpiler";

export class PluginManager{
  plugins:string[] = [];
  runningPlugins:ForkScope[] = [];
  private logger: Logger;
  constructor(protected ctx:Context) {
    this.restart()
    this.logger = this.ctx.logger("blockly")
  }
  restart(){
    this.runningPlugins.forEach(t=>t.dispose())
    this.runningPlugins = []
    if(this.plugins.length == 0){
      this.logger?.info("No plugin loaded")
      return;
    }
    this.logger.info("Loading "+this.plugins.length +" plugin(s)")
    this.plugins.forEach(p=>{
      let context : any = {}
      context.module = {
        exports:{}
      }
      context.require = require;
      context.segment = segment;
      let plugin = null
      try{
        const code = `const {${Object.keys(context).join(',')}} = this;${esModuleToCommonJs(p)}`
        const pluginFunction = new Function(code)
        pluginFunction.call(context)
        plugin = context.module.exports
      }catch (e){
        this.ctx.logger("blockly").warn(e);
      }
      if(plugin && plugin['apply'])
        this.runningPlugins.push(this.ctx.plugin(plugin))
    })
    this.logger.info("Loaded "+this.runningPlugins.length +" plugin(s)")
  }
}
