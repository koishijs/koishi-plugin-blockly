<template>
  <k-layout>
    <template #left>
      <div style="display: flex;flex-direction: row-reverse;padding-right: 10px;padding-top: 10px">
        <i @click="send('create-blockly-block')" style="cursor: pointer"><new-file/></i>
      </div>
      <hr/>
      <div style="height: 60%">
        <el-scrollbar>
          <blockly-tab-group :data="Object.fromEntries(store.blockly.map(t=>[t.id,t]))" v-model="currentId">
          </blockly-tab-group>
        </el-scrollbar>
      </div>
      <hr/>
      <div style="height: 20%;padding:10px">
        <div v-if="currentId">
          <k-button @click="save()">保存并应用更改</k-button>
          <k-button @click="enablePlugin()">启用插件</k-button>
          <k-button @click="disablePlugin()">禁用插件</k-button>
          <k-button @click="renamePlugin()">重命名插件</k-button>
          <k-button @click="deletePlugin()">删除插件</k-button>
        </div>
      </div>
    </template>
    <div style="height: 100%">
      <k-empty v-if="currentId===undefined && !init">
        <div>Nothing</div>
      </k-empty>
      <keep-alive v-show="(currentId!=null && !loading )|| init">
        <blockly ref="editor"></blockly>
      </keep-alive>
      <div v-show="loading && !init">
        Loading....
      </div>
    </div>
  </k-layout>
</template>

<script setup lang="ts">
import {onMounted, ref, watch, nextTick} from "vue";
import {store,send} from "@koishijs/client"
import blockly from "./blockly.vue"
import blocklyTabGroup from './components/blockly-tab-group.vue'
import NewFile from "./icons/new-file.vue";
const editor = ref(null)
const currentId = ref(undefined)
const loading = ref(false)
let oldCurrentId = {value:undefined}
nextTick(() => {
  console.info(editor)
})
const init=ref(true);
onMounted(()=>{
    watch(currentId,async (r,s)=>{
      loading.value=true;
      if(s!=undefined)await send('save-blockly-block',parseInt(s.toString()),editor.value.save())
      const data = await send("load-blockly-block",parseInt(r.toString()));
      loading.value=false;
      await nextTick(()=>{
        oldCurrentId = currentId;
        editor.value.load(data);
      })
    })
    nextTick(()=>{
      editor.value.setAutoSaveListener(()=>{
        save();
      });
    })
  })
async function save(){
  if(currentId.value!=undefined)await send('save-blockly-block',currentId.value,editor.value.save())
}
async function enablePlugin(){
  if(currentId.value!=undefined)await send('set-blockly-block-state',currentId.value,true)
}
async function disablePlugin(){
  if(currentId.value!=undefined)await send('set-blockly-block-state',currentId.value,false)
}
async function renamePlugin(){
  if(currentId.value!=undefined)await send('rename-blockly-block',currentId.value,prompt('输入重命名的插件名词','未命名Koishi插件'))
}
async function deletePlugin(){
  if(currentId.value!=undefined)
  if(confirm("确定删除当前插件?")){
    await send('delete-blockly-block',currentId.value)
    window.location.reload() // The temporary solution
  }
}
setTimeout(()=>init.value=false,500);
</script>
