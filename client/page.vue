<template>
  <ImportDialog v-model="dialogOpenStates.import" @callback="importPlugin"></ImportDialog>
  <ExportDialog v-model="dialogOpenStates.export"></ExportDialog>
  <k-layout class="page-blockly">
    <template #header>
        Blockly - {{store.blockly.filter((v)=>v.id?.toString()===currentId?.toString())?.[0]?.name ?? '主页'}} {{saving?'保存中...':''}}
    </template>
    <template #left>
      <div class="create" style="display: flex;flex-direction: row-reverse;padding-right: 10px;padding-top: 10px">
        <i @click="create()" style="cursor: pointer;padding-right: 5px"><new-file/></i>
        <i @click="dialogOpenStates.import=true" style="cursor: pointer;padding-right: 20px"><import-icon/></i>
      </div>
      <div class="list" style="height: 60%">
        <el-scrollbar>
          <blockly-tab-group :data="Object.fromEntries(store.blockly.map(t=>[t.id,t]))" v-model="currentId">
          </blockly-tab-group>
        </el-scrollbar>
      </div>
      <div style="height: 40%;padding:10px">
        <div v-if="currentId">
          <k-button @click="build()">编译插件</k-button>
          <k-button @click="enablePlugin()">启用插件</k-button>
          <k-button @click="disablePlugin()">禁用插件</k-button>
          <k-button @click="renamePlugin()">重命名插件</k-button>
          <k-button @click="deletePlugin()">删除插件</k-button>
          <k-button @click="exportPlugin()">导出插件</k-button>
        </div>
      </div>
    </template>
    <div style="display:flex;flex-flow:column nowrap;height: 100%">
    <div style="height: 100%">
      <k-empty v-if="currentId===undefined && !init">
        <div>在左侧选择或创建一个Blockly代码</div>
      </k-empty>
      <keep-alive v-show="workspaceType === 'blockly' && (currentId!=null && !loading )|| init ">
        <blockly ref="editor" v-model:flow="flow" v-model:workspace="workspaceType"></blockly>
      </keep-alive>
      <div v-show="workspaceType === 'data-flow' && (currentId!=null && !loading )|| init" style="height: 100%">
        <data-flow v-model:flow="flow" v-model:workspace="workspaceType"></data-flow>
      </div>
      <div v-show="loading && !init">
        <k-empty v-if="currentId===undefined && !init">
          <div>Loading...</div>
        </k-empty>
      </div>

    </div>
    <div class="transition-animation" style="border-top:3px solid var(--bg1);display:flex;flex-flow:column nowrap;" :style="{height:currentPanelId.toString()==='hidden' ? '25px' : '40%'}" v-if="currentId!=undefined">
      <div style="height: 25px;background: var(--bg1);display: flex;width: 100%">
        <div style="height:100%;display: inline-flex;align-self: center;padding-left: 20px;padding-right: 20px;" @click="currentPanelId = 'build'" :style="{background: currentPanelId=='build'?'var(--bg3)':''}">编译</div>
        <div style="height:100%;display: inline-flex;align-self: center;padding-left: 20px;padding-right: 20px" @click="currentPanelId = 'result'" :style="{background: currentPanelId=='result'?'var(--bg3)':''}">代码结果</div>
        <div style="height:100%;display: inline-flex;align-self: center;padding-left: 20px;padding-right: 20px" @click="currentPanelId = 'log'" :style="{background: currentPanelId=='log'?'var(--bg3)':''}">运行日志</div>
        <div style="margin-left: auto;align-self: center;height: 100%;margin-right: 20px;">
          <div style="height: 18px;width: 18px;background: var(--bg1);padding: 2px;margin: 2px" @click="currentPanelId = 'hidden'">
            <window/>
          </div>
        </div>
      </div>

      <div style="overflow-y: scroll;overflow-x: scroll;background: var(--bg2);color:var(--fg2);height: 100%;padding: 10px" class="scroll" v-if="currentPanelId!='hidden'">
        <component :is="panels[currentPanelId.toString()]" :current="currentId" :blocklyInformation="blocklyToolboxInformation"></component>
      </div>
    </div>
    </div>
  </k-layout>
</template>

<script setup lang="ts">
import {onMounted, ref, watch, nextTick} from "vue";
import {store,send} from "@koishijs/client"


import ImportDialog from './components/dialogs/import.vue';
import ExportDialog from './components/dialogs/export.vue';

const dialogOpenStates = ref<{
  import:boolean,
  export:false | string
}>({
  import:false,
  export:false
})

import blockly from "./blockly.vue"
import blocklyTabGroup from './components/blockly-tab-group.vue'
import { ElMessageBox } from 'element-plus'
import ToolboxBuild from './components/toolbox/build.vue'
import ToolboxCode from './components/toolbox/code.vue'
import NewFile from "./icons/new-file.vue";
import {gzip,ungzip} from 'pako'
import {stringToArrayBuffer} from "./utils";
import {ElDialog} from 'element-plus'
import ImportIcon from "./icons/import.vue"

import Window from "./icons/window.vue";
import DataFlow from "./data-flow.vue"
const editor = ref(null)
const currentId = ref(undefined)
const loading = ref(false)
let oldCurrentId = {value:undefined}
const init=ref(false);
const saving=ref(false);
const workspaceType = ref('blockly')
const flow = ref({})

const currentPanelId = ref('hidden')
let blocklyToolboxInformation = ref({
  build:'点击左侧"编译插件"查看',
  code:'点击左侧"编译插件"查看'
})
const panels = {
  'build': ToolboxBuild,
  'result': ToolboxCode
}
onMounted(()=>{
    watch(currentId,async (r,s)=>{
      if(!r)return;
      loading.value=true;
      const data = await send("load-blockly-block",parseInt(r.toString()));
      loading.value=false;
      await nextTick(()=>{
        oldCurrentId = currentId;
        editor.value.load(data);
      })
      blocklyToolboxInformation.value.build = '点击左侧"编译插件"查看'
      blocklyToolboxInformation.value.code = '点击左侧"编译插件"查看'
    })
    watch(currentPanelId,async ()=>{
      const svgResize = setInterval(()=>{
        console.info('resize')
        editor.value.updateSize()
      },10)
      setTimeout(()=>{
        clearInterval(svgResize)
      },1000)
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
  if(currentId.value==undefined)return
  blocklyToolboxInformation.value.build="正在开始编译.......\n";
  let code
  try {
    code = editor.value.build();
    blocklyToolboxInformation.value.code = code
  }catch (e){
    blocklyToolboxInformation.value.build+="编译时发生错误:"+e.toString()
    return
  }
  blocklyToolboxInformation.value.build+="正在上传......\n";
  await send('save-blockly-block',currentId.value,{code})
  blocklyToolboxInformation.value.build+="上传成功!  \n";
}
async function enablePlugin(){
  if(currentId.value!=undefined)await send('set-blockly-block-state',currentId.value,true)
}
async function disablePlugin(){
  if(currentId.value!=undefined)await send('set-blockly-block-state',currentId.value,false)
}
async function renamePlugin(){
  if(currentId.value!=undefined){
    const name = prompt('输入重命名的插件名词','未命名Koishi插件')
    if(!name)return;
    await send('rename-blockly-block',currentId.value,name)
  }
}
async function deletePlugin(){
  if(currentId.value!=undefined)
    if(await ElMessageBox.confirm("确定删除当前插件?") === 'confirm'){
      await send('delete-blockly-block',currentId.value)
      currentId.value = undefined
    }
}
async function exportPlugin(){
  if(currentId.value!=undefined){
    const name = store.blockly.filter((v)=>v.id?.toString()==currentId.value)[0]?.name
    dialogOpenStates.value.export = `插件名称: ${name}\n导出时间: ${new Date().toLocaleString()}\n-=-=-=-=--=-=-=-=- BEGIN KOISHI BLOCKLY BLOCK V1 -=-=--=-=-=--=-=--=-=-=-\n${btoa(String.fromCharCode.apply(null, gzip(encodeURI(JSON.stringify({version:1,body:editor.value.save(),name}))))).replace(/(.{64})/g, "$1\n")}\n-=-=--=-=-=--=-=-=-=- END KOISHI BLOCKLY BLOCK V1 -=-=--=-=-=--=-=--=-=-=-`.replace("\n\n","\n")
  }
}
async function importPlugin(content){
  if(content.length==0)return;
  const data_body = content.match(/[=–-]+\s+BEGIN KOISHI BLOCKLY BLOCK V1\s+[=–-]+\n([\s\S]+)\n[=–-]+\s+END KOISHI BLOCKLY BLOCK V1\s+[=–-]+/)?.[1]
    .replace(/[\r\n\t ]/g,'')
  if(!data_body)return;
  const data = JSON.parse(decodeURI(String.fromCharCode.apply(null, ungzip(stringToArrayBuffer(atob(data_body))))))
  if(!data)return;
  const id = await send('create-blockly-block')
  await send('save-blockly-block',id,data)
  currentId.value = id.toString()
}
</script>

<style scoped>
.scroll::-webkit-scrollbar {
  width: 10px;
}
.scroll::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0,0,0,0.3);
}
.scroll::-webkit-scrollbar-track{
  height: 1px
}

.transition-animation{
  transition: 0.3s ease;
}
</style>

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
