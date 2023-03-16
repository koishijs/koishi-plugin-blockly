import * as Blockly from 'blockly'
import {AnyType, ArrayType, ClassType, NumberType, StringType, Type, unify, UnionType} from "./index";
import {BlockSvg} from "blockly";
type BlockInitializer = {init:(...args:any)=>any}
const injectSymbol = Symbol('injected')

export interface TypeDefinition{
  input?:Record<string,Type>
  output?:()=>Type
}
function defineType(target: BlockInitializer,types:TypeDefinition):BlockInitializer{
  if(target[injectSymbol])
    return target
  const init = target.init
  target[injectSymbol] = true
  target.init = function(this:BlockSvg,...args){
    init.apply(this,args)
    if(types.input)
      Object.entries(types.input).forEach(([name,type])=>{
        const input = this.getInput(name)
        if(input)
          input.input_type = type
      })
    if(types.output)
      this.getOutputType = types.output.bind(this)
  }
}

export function initializeType(){

  defineType(Blockly.Blocks['text'],{
    output:()=>new StringType()
  })

  defineType(Blockly.Blocks['send_session_message'],{
    input:{
      content: new UnionType([new StringType(),new ClassType('Segment')])
    }
  })

  defineType(Blockly.Blocks['segment_at'],{
    input:{
      user: new UnionType([new StringType()])
    },
    output:()=>new ClassType('Segment')
  })

  defineType(Blockly.Blocks['lists_create_with'],{
    output:function(this:BlockSvg){
      return new ArrayType(
        unify(
          this.inputList.map(t=>t.name)
            .filter(t=>t)
            .map(t=>this.getInput(t).connection?.targetBlock())
            .filter(t=>t)
            .map(t=>t.getOutputType?.()??new AnyType())
        )
      )
    }
  })


  defineType(Blockly.Blocks['math_number'], {
    output: () => new NumberType()
  })
}
