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
import './msg/zh'
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

Blockly.VerticalFlyout.prototype.getFlyoutScale = ()=>1;

onMounted(() => {
  workspace = Blockly.inject(blockly_workspace.value, {
      toolbox:Toolbox,
      media : '/static/blockly/',
      zoom : {
        controls : true,
        wheel : true,
        startScale : 1,
        maxScale : 3,
        minScale : 0.3,
        scaleSpeed : 1.2
      },
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
    return  `(function(){return {apply:function(ctx){const __logger = ctx.logger('blockly-plugin');${javascriptGenerator.workspaceToCode(workspace)}}}})();`
  },
  setAutoSaveListener(listener){
    listeners.autoSave = listener
  }
})
</script>

<style scoped>

</style>
