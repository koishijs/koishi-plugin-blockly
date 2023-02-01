<template>
  <k-layout>
    <template #header>
        Blockly - {{store.blockly.filter((v)=>v.id?.toString()===currentId?.toString())?.[0]?.name ?? '主页'}} {{saving?'保存中...':''}}
    </template>
    <template #left>
      <div style="display: flex;flex-direction: row-reverse;padding-right: 10px;padding-top: 5px;border-bottom: 1px solid var(--bg1)">
        <i @click="send('create-blockly-block')" style="cursor: pointer"><new-file/></i>
      </div>
      <div style="height: 60%;border-bottom: 1px solid var(--bg1)">
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
    <div style="height: 70%">
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
    <div style="height: 30%;border-top:3px solid var(--bg1);display:flex;flex-flow:column nowrap;">
      <div style="height: 25px;background: var(--bg1);display: flex;width: 100%">
        <div style="height:100%;display: inline-flex;align-self: center;padding-left: 20px;padding-right: 20px;background: var(--bg3)">编译</div>
        <div style="height:100%;display: inline-flex;align-self: center;padding-left: 20px;padding-right: 20px">代码结果</div>
        <div style="height:100%;display: inline-flex;align-self: center;padding-left: 20px;padding-right: 20px">运行日志</div>
        <div style="margin-left: auto;align-self: center;height: 100%;margin-right: 20px;">
          <div style="height: 18px;width: 18px;background: var(--bg1);padding: 2px;margin: 2px">
            <window/>
          </div>
        </div>
      </div>

      <div style="overflow-y: scroll;overflow-x: hidden" class="scroll">
        1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9 <br>10<br>11<br>12<br>13
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
import Window from "./icons/window.vue";
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
</style>
