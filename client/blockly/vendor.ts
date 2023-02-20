import {store} from '@koishijs/client'
import * as Blockly from "blockly";
import type {BlocklyVendor} from "koishi-plugin-blockly";
export function vendorCallback(){
  if(!store['blockly_vendors'])
    return []
  const vendors : BlocklyVendor[] = Object.values(store['blockly_vendors'])

  vendors.forEach(t=>{
    Blockly.defineBlocksWithJsonArray(t.blocks.map(t=>t.definition))
  })


  console.info(vendors.map(t=>t.blocks).flat(10).map(t=>t.definition).map(t=>t.type).map(t=>({
    'kind': 'block',
    'type': t
  })))

  return vendors.map(t=>t.blocks).flat(10).map(t=>t.definition).map(t=>t.type).map(t=>({
    'kind': 'block',
    'type': t
  }))
}
