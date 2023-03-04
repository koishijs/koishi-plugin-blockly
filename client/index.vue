<template>
  <ImportDialog v-model="dialogOpenStates.import" @callback="importBlockly"></ImportDialog>
  <ExportDialog v-model="dialogOpenStates.export"></ExportDialog>
  <k-layout class="page-blockly">
    <template #header>
        Blockly - {{store.blockly.filter((v)=>v.id?.toString()===currentId?.toString())?.[0]?.name ?? '主页'}} {{saving?'保存中...':''}}
    </template>
    <template #left>
      <SideBar :blocks="store.blockly" v-model:current="currentId" :workspace="editor" :panel="blocklyToolboxInformation" :dialog="dialogOpenStates" :logger="build_console"/>
    </template>
    <div style="display:flex;flex-flow:column nowrap;height: 100%;width: 100%">
    <div style="height: 100%; display: flex;flex-flow: column">
      <k-empty v-if="currentId===undefined && !init">
        <div>在左侧选择或创建一个Blockly代码</div>
      </k-empty>
      <keep-alive v-show="(workspaceType === 'blockly' || workspaceType === 'meta') && (currentId!=null && !loading )|| init ">
        <blockly ref="editor" v-model:flow="flow" v-model:workspace="workspaceType"></blockly>
      </keep-alive>
      <div v-show="workspaceType === 'data-flow' && (currentId!=null && !loading )|| init" style="height: 100%">
        <data-flow v-model:flow="flow" v-model:workspace="workspaceType"></data-flow>
      </div>
      <transition name="meta-ui-change">
        <div style="position: fixed;bottom: 0;top: 0;right: 0;width: 400px;background-color: #ffffff7a;z-index: 1000;backdrop-filter: blur(50px);box-shadow: 9px -7px 20px 0px black;background-size: 50px;" v-if="( workspaceType === 'meta') && (currentId!=null && !loading )|| init ">
          <plugin-meta v-model:workspace="workspaceType" :current="currentId" @metaChange="save()"></plugin-meta>
        </div>
      </transition>

      <!-- <div v-show="workspaceType === 'meta' && (currentId!=null && !loading )|| init" style="height: 100%">
        <plugin-meta v-model:workspace="workspaceType" :current="currentId" @metaChange="save()"></plugin-meta>
      </div> -->

      <div v-show="loading && !init">
        <k-empty v-if="currentId===undefined && !init">
          <div>Loading...</div>
        </k-empty>
      </div>

    </div>
    <div class="transition-animation" style="border-top:3px solid var(--bg1);display:flex;flex-flow:column nowrap;" :style="{height:currentPanelId.toString()==='hidden' ? '25px' : '40%'}" v-if="currentId!=undefined">
      <div style="height: 25px;background: var(--bg1);display: flex;width: 100%;z-index: 999;">
        <div style="height:100%;display: inline-flex;align-self: center;padding-left: 20px;padding-right: 20px;border-radius: 4px 4px 0px 0px;cursor: pointer;" @click="currentPanelId = 'build'" :style="{background: currentPanelId=='build'?'var(--bg3)':''}">编译</div>
        <div style="height:100%;display: inline-flex;align-self: center;padding-left: 20px;padding-right: 20px;border-radius: 4px 4px 0px 0px;cursor: pointer;" @click="currentPanelId = 'result'" :style="{background: currentPanelId=='result'?'var(--bg3)':''}">代码结果</div>
        <div style="height:100%;display: inline-flex;align-self: center;padding-left: 20px;padding-right: 20px;border-radius: 4px 4px 0px 0px;cursor: pointer;" @click="currentPanelId = 'log'" :style="{background: currentPanelId=='log'?'var(--bg3)':''}">运行日志</div>
        <div style="margin-left: auto;align-self: center;height: 100%;margin-right: 20px;">
          <div style="height: 18px;width: 18px;background: var(--bg1);padding: 2px;margin: 2px" @click="currentPanelId = 'hidden'">
            <window/>
          </div>
        </div>
      </div>

      <div style="overflow:scroll;color:var(--fg2);height: 100%;width: 100%;contain: size" class="scroll" v-show="currentPanelId!='hidden'" :style="{background:currentPanelId === 'build'?'black':'var(--bg2)'}">
        <ToolboxBuild :current="currentId" ref="build_console" v-show="currentPanelId==='build'" style="margin: 6px"></ToolboxBuild>
        <ToolboxCode :current="currentId" :blocklyInformation="blocklyToolboxInformation" v-show="currentPanelId==='result'" v-if="currentPanelId!='hidden'"></ToolboxCode>
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
import SideBar from './components/sidebar/index.vue';
import PluginMeta from './meta.vue'

const dialogOpenStates = ref<{
  import:boolean,
  export:false | string
}>({
  import:false,
  export:false
})

import blockly from "./blockly/blockly.vue"
import ToolboxBuild from './components/console/build.vue'
import ToolboxCode from './components/console/code.vue'
import Window from "./icons/window.vue";
import DataFlow from "./flow-engine/data-flow.vue"
import {importPlugin as _import, saveBlockly} from "./api/manager";
const editor = ref(null)
const currentId = ref(undefined)
const loading = ref(false)
let oldCurrentId = {value:undefined}
const init=ref(false);
const saving=ref(false);
const workspaceType = ref('blockly')
const flow = ref({})
const build_console = ref(null)

const currentPanelId = ref('hidden')
let blocklyToolboxInformation = ref({
  build:'点击左侧"编译插件"查看'
})
const panels = {
  'build': ToolboxBuild,
  'result': ToolboxCode
}

let saveTimer = null
async function saveNow(){
  await saveBlockly(currentId.value,editor.value)
}
function save(){
  if(saveTimer)clearTimeout(saveTimer)
  saveTimer = setTimeout(()=>{
    saveNow();
    saveTimer = null
  },1000);
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
    })
    watch(currentPanelId,async (c,o)=>{
      if(![c,o].includes('hidden'))return;
      const svgResize = setInterval(()=>{
        console.info('resize')
        editor.value.updateSize()
      },10)
      setTimeout(()=>{
        clearInterval(svgResize)
      },1000)
    })
    nextTick(()=>{
      editor.value.setAutoSaveListener(save);
    })
  })
async function importBlockly(content,asNewPlugin){
  const newPluginId = await _import(content,asNewPlugin)
  if(!newPluginId){
    return
  }
  currentId.value = newPluginId
}

</script>

<style scoped>
.scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
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
.transition-animation *{
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
.ui-change-enter-active,
.ui-change-leave-active {
  // display:;
  position: absolute;
  transition: 0.3s ease;
}

.ui-change-enter-from,
.ui-change-leave-to {
  // transform: ;
  opacity: 0;
  transform: translateY(-10px);

}
.meta-ui-change-enter-active,
.meta-ui-change-leave-active {
  // display:;
  transition: 0.3s ease;
}

.meta-ui-change-enter-from,
.meta-ui-change-leave-to {
  // transform: ;
  transform: translateX(400px);
  // opacity: 0;

}
</style>
