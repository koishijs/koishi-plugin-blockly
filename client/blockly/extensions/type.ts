import {unregisterIfRegistered} from "./index";
import * as Blockly from 'blockly'
import {BlockSvg} from "blockly";
export function typeMutatorExtension(){
  unregisterIfRegistered("union_mutator")
  Blockly.Extensions.registerMutator('union_mutator', {
    updateShape_: function(){
      // Delete every input which starts with "TYPE_" and less than itemCount_
      this.inputList
        .filter(input => input.name.startsWith("TYPE_"))
        .filter(input => parseInt(input.name.split("_")[1]) < this.itemCount_)
        .forEach(input => this.removeInput(input.name))
      // Add new inputs
      for(let i = 0; i < this.itemCount_; i++){
        if(!this.getInput("TYPE_" + i)){
          const input = this.appendValueInput("TYPE_" + i)
          input.align = Blockly.ALIGN_RIGHT
          if(i == 0){
            input.appendField("类型")
          }else{
            input.appendField("或")
          }
        }
      }
    },
    decompose: function(workspace){
      const containerBlock = workspace.newBlock('type_union_root');
      containerBlock.initSvg();
      let connection = containerBlock.getInput('types').connection;
      for(let i = 0; i < this.itemCount_; i++){
        const itemBlock = workspace.newBlock('type_union_entity');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      }
      return containerBlock;
    },
    compose: function(topBlock){
      this.itemCount_ = 0;
      let itemBlock = topBlock.getInputTargetBlock('types');
      while(itemBlock){
        this.itemCount_++;
        itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      }
      this.updateShape_();
    },
    saveExtraState: function(workspace){
      return {
        'itemCount': this.itemCount_
      }
    },
    loadExtraState: function(state){
      this.itemCount_ = state['itemCount'];
      this.updateShape_()
    }
  },undefined,['type_union_entity'])

  unregisterIfRegistered("object_mutator")
  Blockly.Extensions.registerMutator('object_mutator', {
    updateShape_: function(){
      // Each property is a value input , and contains a field for the property name
      this.properties_?.forEach((property,index)=>{
        if(!this.getInput("PROPERTY_" + property)){
          const input = this.appendValueInput("PROPERTY_" + property)
          input.align = Blockly.ALIGN_RIGHT
          input.appendField(property)
        }
      })
      this.inputList.filter(input => input.name.startsWith("PROPERTY_"))
        .filter(input => !this.properties_.includes(input.name.split("_")[1]))
        .forEach(input => this.removeInput(input.name))
    },
    decompose: function(workspace){
      const containerBlock = workspace.newBlock('type_object_root');
      containerBlock.initSvg();
      let connection = containerBlock.getInput('properties').connection;
      this.properties_?.forEach((property)=>{
        const itemBlock = workspace.newBlock('type_object_entity');
        itemBlock.initSvg();
        itemBlock.setFieldValue(property,'name')
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      })
      return containerBlock;
    },
    compose: function(topBlock){
      const properties = []
      let itemBlock = topBlock.getInputTargetBlock('properties');
      while(itemBlock){
        properties.push(itemBlock.getFieldValue('name'))
        itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      }
      this.properties_ = properties;
      this.updateShape_()
    },
    saveExtraState: function(workspace){
      return {
        'properties': this.properties_
      }
    },
    loadExtraState: function(state){
      this.properties_ = state['properties'];
      this.updateShape_()
    }
  },undefined,['type_object_entity'])
}
