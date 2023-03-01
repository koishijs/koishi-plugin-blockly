import * as Blockly from 'blockly'
import {unregisterIfRegistered} from "./index";
import {BlockSvg, FieldDropdown} from "blockly";
export function registerSegmentParserMutator(){
  unregisterIfRegistered('segment_parser')
  Blockly.Extensions.registerMutator('segment_parser', {
    decompose: function(workspace) {
      let topBlock = workspace.newBlock('parse_segment_root');
      topBlock.initSvg();
      let connection = topBlock.getInput('types').connection;
      const branches : Blockly.Input[] = this.inputList.filter(t=>t.name.startsWith('branch_type_'))
      branches.forEach(s=>{
        const type = this.getFieldValue(s.name+'_selector')
        let itemBlock = workspace.newBlock("segment_type");
        itemBlock.setFieldValue(type,'type')
        itemBlock.initSvg()
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      })
      return topBlock;
    },
    compose: function(topBlock) {
      this.inputList.filter(t=>t.name.startsWith('branch_type_') || t.name.startsWith('branch_action_'))
        .forEach(t=>this.removeInput(t.name))
      const branches = topBlock.getChildren()
      if(!branches.length || branches.length<=0){
        return;
      }
      let current = branches[0]
      let i = 0
      while(current){
        this.addBlockInput(current.getFieldValue("type"),i)
        current = current.getNextBlock();
        i++;
      }
    },
    saveExtraState: function() {
      const inputs = this.inputList.filter(t=>t.name.startsWith('branch_type_')).map(s=>this.getFieldValue(s.name+'_selector'))
      console.info(inputs)
      return inputs
    },

    loadExtraState: function(state) {
      state?.forEach((t,i)=>this.addBlockInput(t,i))
      console.info(state)
    },
    addBlockInput(type,i){
      if(this.inputList.some(t=>t.name == "branch_type_"+i))return;
      const select = this.appendDummyInput("branch_type_"+i)
      select.appendField("如果消息元素是")
      select.appendField(new FieldDropdown([
        ["at消息", "at"],
        ["引用回复", "quote"],
        ["图片", "image"]
      ]),"branch_type_"+i+"_selector")
      this.setFieldValue(type,"branch_type_"+i+"_selector")
      const action = this.appendStatementInput("branch_action_"+i)
      action.appendField("则运行")
    }
  },undefined,["segment_type"])
  Blockly.defineBlocksWithJsonArray([{
    "type": "segment_type",
    "message0": "消息段类型 %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "type",
        "options": [
          ["at消息", "at"],
          ["引用回复", "quote"],
          ["图片", "image"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },{
    "type": "parse_segment_root",
    "message0": "要解析的消息段类型 %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "types"
      }
    ],
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }])

}
