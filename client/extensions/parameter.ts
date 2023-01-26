import {Mutator} from "blockly";
import * as Blockly from "blockly";

export function parameterListMutator(){
  Blockly.Extensions.registerMutator('parameter_list', {
    decompose: function(workspace) {
      let topBlock = workspace.newBlock('parameter_list');
      topBlock.initSvg();
      if(!Array.isArray(this.parameters)){
        this.parameters = [];
      }
      var connection = topBlock.getInput('parameter_list').connection;
      this.parameters.forEach((parameter)=>{
        let itemBlock = workspace.newBlock(parameter.type);
        itemBlock.setFieldValue(parameter.name,'name')
        itemBlock.setFieldValue(parameter.required?'TRUE':'FALSE','required');
        itemBlock.initSvg()
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      })
      return topBlock;
    },

    compose: function(topBlock) {
      const parameter_links = topBlock.getChildren()
      console.info(parameter_links)
      if(!parameter_links.length || parameter_links.length<=0){
        this.parameters = [];
        return;
      }
      const parameters = [];
      let currentBlock = parameter_links[0];
      while(currentBlock){
        console.info(currentBlock,currentBlock.type)
        const name = currentBlock.getFieldValue('name')
        const required = currentBlock.getFieldValue('required').toLowerCase() === 'true'
        const type = currentBlock.type
        parameters.push({name,required,type})
        currentBlock = currentBlock.getNextBlock();
      }
      this.parameters = parameters;
    },

    saveExtraState: function() {
      return {
        'parameters': this.parameters,
      };
    },

    loadExtraState: function(state) {
      this.parameters = state['parameters'];
    }
  }, undefined, ['any_parameter','string_parameter','number_parameter','boolean_parameter','int_parameter']);
}
