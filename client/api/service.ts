import {Context,Service,Events} from "@koishijs/client";
import type * as cordisType from "cordis";

declare module "@koishijs/client"{
  interface Events<C extends Context> extends cordisType.Events<C> {
    blocklyDependencyChange:()=>void
  }
}

export class BlocklyEditorService extends Service{

    blocksRegistry:Map<string,any[]> = new Map<string, any[]>();

    constructor(ctx:Context) {
        super(ctx,'blocklyEditor');
    }

    protected emitChangeEvent(){
      this.ctx.emit("blocklyDependencyChange")
    }

    register(name:string,blocks:any[]){
      if(this.blocksRegistry.has(name)){
        return false;
      }
      this.caller?.on('dispose',()=>{
        this.unregister(name);
      })
      this.blocksRegistry.set(name,blocks)
      this.emitChangeEvent();
      return true;
    }

    unregister(name:string){
      if(!this.blocksRegistry.has(name)){
        return false;
      }
      let result = this.blocksRegistry.delete(name);
      this.emitChangeEvent();
      return result
    }
}
export function registerBlocklyEditorService(ctx:Context){
    ctx.plugin({
        apply:(ctx:Context)=>{
            new BlocklyEditorService(ctx);
        }
    });
}
