import {IOBlocks} from "./io";
import {ObjectNodes} from "./object";
import {LogicalNodes} from "./logical";
import {StringNode} from "./string";
import {NumericNodes} from "./numeric";
import {Structure} from "./structure";
import {InterfaceNodes} from "./interface";

export const Nodes = [
  ...IOBlocks,
  ...ObjectNodes,
  ...LogicalNodes,
  ...StringNode,
  ...NumericNodes,
  ...Structure,
  ...InterfaceNodes
]
