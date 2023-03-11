import {Workspace} from "blockly";
import * as Blockly from "blockly";
import {ReactiveBindingSet, ReactiveValue} from "../binding";

declare module "blockly"{
  interface Workspace{
    typings: ReactiveBindingSet<ReactiveValue<any>>
  }
}

export function registerTypeManager(workspace:Workspace){
  workspace.typings = new ReactiveBindingSet<ReactiveValue<any>>()
}
