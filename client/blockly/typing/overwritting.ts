import * as Blockly from 'blockly'
import {StringType, Type} from "./index";
import {BlockSvg} from "blockly";
type BlockInitializer = {init:(...args:any)=>any}
const injectSymbol = Symbol('injected')

export interface TypeDefinition{
  input:Record<string,Type>
  output:()=>Type
}
function defineType(target: BlockInitializer,types:TypeDefinition):BlockInitializer{
  if(target[injectSymbol])
    return target
  const init = target.init
  target.init = function(this:BlockSvg,...args){
    init.apply(this,args)
    Object.entries(types.input).forEach(([name,type])=>{
      const input = this.getInput(name)
      if(input)
        input.input_type = type
    })
    this.getOutputType = types.output.bind(this)
  }
}

export function initializeType(){
  defineType(Blockly.Blocks['text'],{
    input:{},
    output:()=>new StringType()
  })
}
