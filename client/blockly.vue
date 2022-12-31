<template>
  <div style="height: 100%;" ref="blockly_workspace"></div>
</template>

<script setup lang="ts">
import * as Blockly from 'blockly';
import * as ZhHans from 'blockly/msg/zh-hans';
import Toolbox from './toolbox.xml?raw';
import {javascriptGenerator} from 'blockly/javascript';
import {ref, onMounted, watch,toRef} from 'vue';
import {Blocks,BlockGenerators} from "./blocks";
const blockly_workspace = ref(null)

let value = defineProps({
  modelValue:Object
})

let _value = toRef(value,"modelValue")

let emits = defineEmits(['update:modelValue'])

Blockly.setLocale(ZhHans);
Blockly.defineBlocksWithJsonArray(Blocks);
Object.entries(BlockGenerators).forEach(([k,v])=>{
  javascriptGenerator[k]=v;
})
let workspace = null;
onMounted(() => {
  workspace = Blockly.inject(blockly_workspace.value,{toolbox:Toolbox})
})
defineExpose({
  save(){
    const code = `(function(){return {apply:function(ctx){const session=null;${javascriptGenerator.workspaceToCode(workspace)}}}})();`
    return {body:Blockly.serialization.workspaces.save(workspace),code};
  },
  load(data){
    return Blockly.serialization.workspaces.load(data,workspace);
  }
})
</script>

<style scoped>

</style>
