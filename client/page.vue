<template>
  <k-layout class="page-blockly">
    <template #header>
        Blockly - {{store.blockly.filter((v)=>v.id?.toString()===currentId?.toString())?.[0]?.name ?? '主页'}} {{saving?'保存中...':''}}
    </template>
    <template #left>
        <i @click="create()" style="cursor: pointer"><new-file/></i>
      <div class="create" style="display: flex;flex-direction: row-reverse;padding-right: 10px;padding-top: 10px">
      </div>
      <div class="list" style="height: 60%">
        <el-scrollbar>
          <blockly-tab-group :data="Object.fromEntries(store.blockly.map(t=>[t.id,t]))" v-model="currentId">
          </blockly-tab-group>
        </el-scrollbar>
      </div>
      <div style="height: 20%;padding:10px">
        <div v-if="currentId">
          <k-button @click="build()">编译插件</k-button>
          <k-button @click="enablePlugin()">启用插件</k-button>
          <k-button @click="disablePlugin()">禁用插件</k-button>
          <k-button @click="renamePlugin()">重命名插件</k-button>
          <k-button @click="deletePlugin()">删除插件</k-button>
        </div>
      </div>
    </template>
    <div style="height: 100%">
      <k-empty v-if="currentId===undefined && !init">
        <div>在左侧选择或创建一个Blockly代码</div>
      </k-empty>
      <keep-alive v-show="(currentId!=null && !loading )|| init">
        <blockly ref="editor"></blockly>
      </keep-alive>
      <div v-show="loading && !init">
        <k-empty v-if="currentId===undefined && !init">
          <div>Loading...</div>
        </k-empty>
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
const init=ref(false);
const saving=ref(false);
onMounted(()=>{
    watch(currentId,async (r,s)=>{
      loading.value=true;
      if(s!=undefined)await send('save-blockly-block',parseInt(s.toString()),{body:editor.value.save()})
      const data = await send("load-blockly-block",parseInt(r.toString()));
      loading.value=false;
      await nextTick(()=>{
        oldCurrentId = currentId;
        editor.value.load(data);
      })
    })
    nextTick(()=>{
      editor.value.setAutoSaveListener(()=>{
        setTimeout(save,0);
      });
    })
  })
async function create() {
  currentId.value = (await send('create-blockly-block')).toString()
}
async function save(){
  saving.value=true;
  if(currentId.value!=undefined)await send('save-blockly-block',currentId.value,{body:editor.value.save()})
  saving.value=false;
}
async function build(){
  if(currentId.value!=undefined)await send('save-blockly-block',currentId.value,{code:editor.value.build()})
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
</script>

<style lang="scss">

.page-blockly {
  .create {
    height: 3rem;
    box-sizing: border-box;
    border-bottom: 1px solid var(--border);
  }

  .list {
    border-bottom: 1px solid var(--border);
  }
}

</style>
