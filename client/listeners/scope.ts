import {Abstract} from "blockly/core/events/events_abstract";
import {BlockMove} from "blockly/core/events/events_block_move";
import {BlockCreate} from "blockly/core/events/events_block_create";
import {WorkspaceSvg} from "blockly";
import * as Blockly from "blockly";

export function disableOrphansAndOrphanSessions(_event:Abstract){
  if (!(_event.type === 'move' || _event.type === 'create'))return;
  const event = _event as BlockMove | BlockCreate
  if (!event.workspaceId || !event.blockId)
    return;
  const eventWorkspace = event.getEventWorkspace_() as WorkspaceSvg;
  if(!eventWorkspace)
    return;
  let block = eventWorkspace.getBlockById(event.blockId);
  Blockly.Events.disableOrphans(_event);
  if(!block || !block['scope']){
    return;
  }
  if(!block['scope']['consumes']){
    const children = block.getChildren(false)
    return;
  }
  console.info(block)
  const consumes : Map<string,any> = new Map((Array.isArray(block['scope']['consumes']) ? block['scope']['consumes'] : [block['scope']['consumes']]).map(t=>[t]));

  block.setWarningText(null)
  let current = block
  while(current = current.getParent()){
    if(!current['scope'] || !current['scope']['provides'])continue;
    const provides = Array.isArray(current['scope']['provides']) ? current['scope']['provides'] : [current['scope']['provides']];
    provides.forEach(provide => {
      consumes.delete(provide)
    })
  }
  if(consumes.size) {
    block.setEnabled(false);
    block.setWarningText('The consumer should be placed in the variable scope of the provider:'+Array.from(consumes.keys()).join(','))
  }
}
