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
  if(!block || !block['is_session_block'] || !block.isEnabled()) {
    return;
  }
  let current = block
  while(current = current.getParent()){
    if(current && current['is_session_provider']){
      return;
    }
  }
  block.setEnabled(false);
}
