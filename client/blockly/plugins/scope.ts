import {BlockSvg, Workspace, WorkspaceSvg,Block} from "blockly";
import {Abstract} from "blockly/core/events/events_abstract";
import {BlockMove} from "blockly/core/events/events_block_move";
import {BlockCreate} from "blockly/core/events/events_block_create";

declare module "blockly"{
  interface Block{
    block_state: BlockStateManager
  }
}

export class BlockStateManager{
  cached_consuming:Map<string, Set<string>> = new Map
  providing:string[] = []
  consuming:string[] = []

  consume_reload_callbacks:Map<string,Function> = new Map

  constructor(protected block:Block){

  }

  using(name,reload_callback){
    this.consume_reload_callbacks.set(name,reload_callback)
    setTimeout(()=>this.addConsume(name),0);
    return ()=>{
      this.consume_reload_callbacks.delete(name)
      this.removeConsume(name)
    }
  }

  removeFromParent(parent:Block){
    parent.block_state.removeChildren(this.block)
  }

  removeChildren(children:Block){
    let deleted_consumes = []
    children.block_state.cached_consuming.forEach((consumes,consumeId)=> {
      consumes.forEach(fromEntry => {
        if(this.removeCachedConsumeInternal(consumeId,fromEntry))
          deleted_consumes.push(consumeId)
      })
    })
    deleted_consumes.forEach(consumeId=>{
      this.block.getParent()?.block_state.removeCachedConsume(consumeId,children.id)
    })
  }

  removeCachedConsume(consumeId:string,fromEntry:string){
    if(this.removeCachedConsumeInternal(consumeId,fromEntry))
      this.block.getParent()?.block_state.removeCachedConsume(consumeId,fromEntry)
  }

  protected removeCachedConsumeInternal(consumeId:string,fromEntry:string):boolean{
    if(this.providing.includes(consumeId)){
      this.block.workspace.getBlockById(fromEntry)?.block_state.notifyConsumeReload(consumeId)
    }
    if(!this.cached_consuming.has(consumeId))
      return false
    const parentConsumes = this.cached_consuming.get(consumeId)
    parentConsumes.delete(fromEntry)
    if(parentConsumes.size<=0){
      this.cached_consuming.delete(consumeId)
      return true
    }
    return false
  }

  addConsume(consumeId:string){
    if(!this.consuming.includes(consumeId)) {
      this.consuming.push(consumeId)
      this.addCachedConsume(consumeId, this.block.id)
    }
  }

  removeConsume(consumeId:string){
    if(this.consuming.includes(consumeId)) {
      this.consuming.splice(this.consuming.indexOf(consumeId),1)
      this.removeCachedConsume(consumeId,this.block.id)
    }
  }

  addCachedConsume(consumeId:string,fromEntry:string){
    if(this.providing.includes(consumeId)){
      this.block.workspace.getBlockById(fromEntry)?.block_state.notifyConsumeReload(consumeId)
    }
    if(!this.cached_consuming.has(consumeId))
      this.cached_consuming.set(consumeId,new Set)
    this.cached_consuming.get(consumeId).add(fromEntry)
    this.block.getParent()?.block_state.addCachedConsume(consumeId,fromEntry)
  }

  notifyConsumeReload(consumeId:string){
    if(this.consume_reload_callbacks.has(consumeId))
      this.consume_reload_callbacks.get(consumeId)()
  }

  recoverCachedConsume(){
    this.cached_consuming.forEach((fromEntries,consumeId)=>{
      fromEntries.forEach(fromEntry=>{
        this.block.getParent()?.block_state.addCachedConsume(consumeId,fromEntry)
      })
    })
  }
}

export function registerScope(workspace:Workspace){
  workspace.addChangeListener((_event:Abstract)=>{
    if (!(_event.type === 'move' || _event.type === 'create'))return;
    const event = _event as BlockMove | BlockCreate
    const targetBlock = event.getEventWorkspace_().getBlockById(event.blockId)
    if(!targetBlock.block_state)
      targetBlock.block_state = new BlockStateManager(targetBlock)
    if(event.type!='move')return;
    let new_event = event as BlockMove
    if(new_event.oldParentId)
      targetBlock.block_state.removeFromParent(targetBlock.workspace.getBlockById(new_event.oldParentId))
    if(new_event.newParentId)
      targetBlock.block_state.recoverCachedConsume()
  })
}
