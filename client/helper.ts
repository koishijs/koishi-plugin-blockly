import * as Blockly from 'blockly'
export function defineBlockWithJsonCustomFields(block:any){
  Blockly.Blocks[block['type']] = {
    init: function() {
      this.jsonInit(block);
      this.imports = block.imports;
    }
  }
}

export function defineBlocksWithJsonCustomFields(blocks:any[]){
  blocks.forEach(defineBlockWithJsonCustomFields)
}
