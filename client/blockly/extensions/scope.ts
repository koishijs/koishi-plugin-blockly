import * as Blockly from "blockly";
import {unregisterIfRegistered} from "./index";

export const scopes = ['session','argument']

export function registerScopeExtensions(){
  scopes.forEach(t=>{
    consumerExtension(t)
    providerExtension(t)
  })
}

export function consumerExtension(name:string){
  unregisterIfRegistered(name+'_consumer')
  Blockly.Extensions.register(name+'_consumer', function(){
    if(!this['scope'])this['scope'] = {};
    if(!this['scope']['consumes'])this['scope']['consumes'] = [];
    if(!this['scope']['consumes'].includes(name))
      this['scope']['consumes'].push(name);
  })
}

export function providerExtension(name:string){
  unregisterIfRegistered(name+'_provider')
  Blockly.Extensions.register(name+'_provider', function(){
    if(!this['scope'])this['scope'] = {};
    if(!this['scope']['provides'])this['scope']['provides'] = [];
    if(!this['scope']['provides'].includes(name))
      this['scope']['provides'].push(name);
  })
}
