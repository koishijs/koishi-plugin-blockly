import {FlowIcon} from "../../icons/flow";
import {BlockSvg, FieldImage} from "blockly";
import {v4} from "uuid";
import {IEditorState} from "baklavajs";
import {workspaces} from "blockly/core/serialization";
export interface FlowBlockEntity{
  workflow: Pick<IEditorState, 'graph'>
  updateShape_: (object:IEditorState)=>void
}
export const FlowBlock = {
  "type": "flow_process",
  "message0": "%1 数据处理",
  "args0": [
    {
      "type": "field_image",
      "name":"edit_flow_button",
      "src": FlowIcon,
      "width": 20,
      "height": 20,
      "alt": "编辑"
    }
  ],
  "output":null,
  "colour": 230,
  init(this:BlockSvg & FlowBlockEntity){
    (this.getField("edit_flow_button") as FieldImage).setOnClickHandler(()=>{
      if(!this.workflow)
        this.workflow = {graph: {id: v4(), nodes: [], connections: [], inputs: [], outputs: []}}
      this.workspace['topLevel'].setWorkspaceType('data-flow');
      this.workspace.getAllBlocks(false).forEach(t=>t.unselect())
      this.workspace['topLevel'].waitFlowEngineSave({graph:this.workflow.graph,graphTemplates:[]}).then(r=>{
        this.workflow = {graph:r.graph}
        this.updateShape_(r)
      })
    })
    this.saveExtraState = function(){
       return {workflow:this.workflow}
    }
    this.loadExtraState = function(flow){
      this.workflow = flow.workflow
      this.updateShape_(flow.workflow)
    }
    this.updateShape_= function(this:BlockSvg,workflow){
      if(!workflow)return;
      const inputs = this.inputList.map(t=>t.name).filter(t=>t.startsWith('input_'))
      const workflow_inputs = workflow.graph.nodes.filter(t=>t.type==='input').map(t=>'input_'+t.inputs.name.value) as unknown as string[]
      console.info(workflow_inputs,inputs)
      const add_inputs = workflow_inputs.filter(t=>!inputs.includes(t))
      const remove_inputs = inputs.filter(t=>!workflow_inputs.includes(t))
      add_inputs.forEach(t=>{
        this.appendValueInput(t).setCheck(null).appendField(t.substring(6))
      })
      remove_inputs.forEach(t=>{
        this.removeInput(t)
      })
    }
  }
}

export function flowProcessBlockGenerator(block:BlockSvg & FlowBlockEntity){
  const flow = block.workflow
  console.info(flow)
}

export const FlowBlocks = [
  FlowBlock
]

export const flowBlockGenerators = {
  flow_process: flowProcessBlockGenerator
}
