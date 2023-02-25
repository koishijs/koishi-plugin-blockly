<template>
  <div style="height: 100%;width: 100%">
    <div style="width: 100%;padding: 5px;padding-left: 20px;height:25px">
      <button class="menu-button" @click="exitAndSave">退出编辑模式</button>

      </div>
    <div style="width:100%;height: 100%"><div style="height: 100%;" ref="baklava_workspace"></div></div>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref,unref,watch,toRef} from "vue";

let $emit = defineEmits(['update:workspace','update:flow'])
let props = defineProps(['flow'])
let flow = toRef(props,'flow')
let baklavaInstance = null
const baklava_workspace = ref(null)
import {createBaklava} from "baklavajs/dist/esm/bundle";
import "@baklavajs/themes/dist/classic.css"
import {Nodes} from "./nodes";
import {IEditorState} from "baklavajs";

onMounted(()=>{
  const baklava = createBaklava(unref(baklava_workspace))
  const emptyPlugin = baklava.editor.save()
  baklavaInstance = baklava
  Nodes.forEach(t=>baklava.editor.registerNodeType(t[0],{category:t[1]}))
  watch(flow,(flow:IEditorState)=>{
    if(flow.graph && flow.graphTemplates)
      baklava.editor.load(flow)
    else
      baklava.editor.load(emptyPlugin)
  })
})
function exitAndSave(){
  $emit('update:flow',baklavaInstance.editor.save())
  $emit('update:workspace','blockly')
}

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

<style>
.baklava-node-palette::-webkit-scrollbar {
  width: 10px;
}
.baklava-node-palette::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: var(--fg2);
}
.baklava-node-palette::-webkit-scrollbar-track{
  height: 1px
}
</style>
