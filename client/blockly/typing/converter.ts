import {BlockSvg, WorkspaceSvg} from "blockly";
import {Type} from "./index";

export function convertTypeToBlock(workspace:WorkspaceSvg,type:Type):BlockSvg{
  switch (type.getTypeName()){
    case 'string':
      return workspace.newBlock('type_string')
  }
}
