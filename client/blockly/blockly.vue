<template>
  <div style="height: 100%;flex:auto;margin-bottom: 35px">
    <div style="width: 100%;padding: 5px;padding-left: 20px;height:25px;border-bottom: 1px solid var(--bg1)">
      <button class="menu-button" @click="$emit('update:workspace','meta')">编辑插件元数据</button>
    </div>
    <div style="height: 100%;flex:auto" ref="blockly_workspace"></div>
  </div>
</template>

<script setup lang="ts">
import * as Blockly from 'blockly';
import * as ZhHans from 'blockly/msg/zh-hans';
import * as LexicalVariables from '@mit-app-inventor/blockly-block-lexical-variables';
import Toolbox from './toolbox.xml?raw';
import {javascriptGenerator} from 'blockly/javascript';
import {ref, onMounted, toRef, nextTick} from 'vue';
import {Blocks,BlockGenerators} from "./blocks";
import {registerExtensions} from "./extensions";
import {disableOrphansAndOrphanConsumersEvent} from "./listeners/consumer";
import {autoSaveListener} from "./listeners/auto-save";
import './msg/zh'
import {defineBlocksWithJsonCustomFields} from "../helper";
const blockly_workspace = ref(null)

let value = defineProps({
  modelValue:Object,
  workspace:String
})

let _value = toRef(value,"modelValue")

let emits = defineEmits(['update:modelValue','update:workspace'])

Blockly.setLocale(ZhHans);

defineBlocksWithJsonCustomFields(Blocks);

registerExtensions();
Object.entries(BlockGenerators).forEach(([k,v])=>{
  javascriptGenerator[k]=v;
})
let workspace : Blockly.WorkspaceSvg = null;
let listeners = {autoSave:()=>{}}

Blockly.VerticalFlyout.prototype.getFlyoutScale = ()=>1;

onMounted(() => {
  nextTick(()=>{
    workspace = Blockly.inject(blockly_workspace.value, {
      toolbox:Toolbox,
      media : '/static/blockly/',
      grid : {
        spacing : 20,
        length : 1,
        colour : '#888',
        snap : false
      },
      zoom:{
        controls:true,
        wheel:true,
        startScale:1,
        maxScale:3,
        minScale:0.3,
        scaleSpeed:1.2
      }
    })
    window.addEventListener('resize',()=>{
      Blockly.svgResize(workspace)
    })
    workspace.addChangeListener(disableOrphansAndOrphanConsumersEvent);
    workspace.addChangeListener(autoSaveListener.bind(listeners));
    LexicalVariables.init(workspace);
  })
})
defineExpose({
  save(){
    Blockly.svgResize(workspace);
    return Blockly.serialization.workspaces.save(workspace);
  },
  load(data){
    Blockly.svgResize(workspace);
    return Blockly.serialization.workspaces.load(data,workspace);
  },
  setAutoSaveListener(listener){
    listeners.autoSave = listener
  },
  updateSize(){
    Blockly.svgResize(workspace);
  },
  getWorkspaceSvg(){
    return workspace;
  }
})
</script>

<style scoped lang="scss">
.menu-button{
  border:none;
  border-radius: 5px;
  padding: 3px 8px;
  margin: 0 10px;
  background: var(--bg3);
  color:var(--fg0);
  &:hover{
    background:var(--bg2);
  }
}
</style>
