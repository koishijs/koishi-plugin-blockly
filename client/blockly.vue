<template>
  <div style="height: 100%;" ref="blockly_workspace"></div>
</template>

<script setup lang="ts">
import * as Blockly from 'blockly';
import * as ZhHans from 'blockly/msg/zh-hans';
import * as LexicalVariables from '@mit-app-inventor/blockly-block-lexical-variables';
import Toolbox from './toolbox.xml?raw';
import {javascriptGenerator} from 'blockly/javascript';
import {ref, onMounted,toRef} from 'vue';
import {Blocks,BlockGenerators} from "./blocks";
import {registerExtensions} from "./extensions";
import {disableOrphansAndOrphanConsumersEvent} from "./listeners/consumer";
import {autoSaveListener} from "./listeners/auto-save";
const blockly_workspace = ref(null)

let value = defineProps({
  modelValue:Object
})

let _value = toRef(value,"modelValue")

let emits = defineEmits(['update:modelValue'])

Blockly.setLocale(ZhHans);
Blockly.defineBlocksWithJsonArray(Blocks);
registerExtensions();
Object.entries(BlockGenerators).forEach(([k,v])=>{
  javascriptGenerator[k]=v;
})
let workspace : Blockly.WorkspaceSvg = null;
let listeners = {autoSave:()=>{}}
onMounted(() => {
  workspace = Blockly.inject(blockly_workspace.value, {
      toolbox:Toolbox,
      media : '/static/blockly/',
      grid : {
        spacing : 20,
        length : 1,
        colour : '#888',
        snap : false
      },
    })
  window.addEventListener('resize',()=>{
    Blockly.svgResize(workspace);
  })
  workspace.addChangeListener(disableOrphansAndOrphanConsumersEvent);
  workspace.addChangeListener(autoSaveListener.bind(listeners));
  LexicalVariables.init(workspace);
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
  build(){
    return  `(function(){return {apply:function(ctx){${javascriptGenerator.workspaceToCode(workspace)}}}})();`
  },
  setAutoSaveListener(listener){
    listeners.autoSave = listener
  },
  updateSize(){
    Blockly.svgResize(workspace);
  }
})
</script>

<style scoped>

</style>
