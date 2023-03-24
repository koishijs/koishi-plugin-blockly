import {BlockSvg, WorkspaceSvg} from "blockly";
import {ArrayType, Type, UnionType} from "./index";

export function convertTypeToBlock(workspace:WorkspaceSvg,type:Type):BlockSvg{
  if(!type)return workspace.newBlock('type_any')
  switch (type.getTypeName()){
    case 'string':
      return workspace.newBlock('type_string')
    case 'number':
      return workspace.newBlock('type_number')
    case 'array':
      const array_block = workspace.newBlock('type_array')
      const array_items = convertTypeToBlock(workspace,(type as ArrayType<Type>).getPrototype())
      array_items.initSvg()
      array_block.getInput('type').connection.connect(
        array_items.outputConnection
      )
      return array_block
    case 'union':
      const union_block = workspace.newBlock('type_union')
      const union_items = (type as UnionType<Type[]>).getPrototype()
      union_block['itemCount_'] = union_items.length
      union_block.initSvg()
      union_block['updateShape_']()
      for(let i=0;i<union_items.length;i++) {
        const union_item = convertTypeToBlock(workspace, union_items[i])
        union_item.initSvg()
        union_block.getInput('TYPE_'+i).connection.connect(
          union_item.outputConnection
        )
      }
      return union_block
    default:
      return workspace.newBlock('type_any')
  }
}
