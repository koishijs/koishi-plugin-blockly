import * as Blockly from 'blockly'

import {} from './blockly/typing'
export function defineBlockWithJsonCustomFields(block:any){
  Blockly.Blocks[block['type']] = {
    init: function() {
      this.jsonInit(block);
      this.imports = block.imports;
      this.template = block.template;
      block.args0?.forEach((item)=>{
        if(item.type === 'input_value'){
          if(!item.input_type)
            return
          const input = this.getInput(item.name)
          if(input)
            input.input_type = item.input_type
        }
      })
      if(block.init)
        block.init.apply(this)
    }
  }
}

export function defineBlocksWithJsonCustomFields(blocks:any[]){
  blocks.forEach(defineBlockWithJsonCustomFields)
}
