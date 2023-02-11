<template>
  <el-dialog v-model="exportMessageBoxVisible" title="导出插件" width="700px">
    <el-input type="textarea" rows="10" input-style="height: 200px;resize:none;" v-model="importAndExportContent"></el-input>
  </el-dialog>
  <el-dialog v-model="importMessageBoxVisible" title="导入插件" width="700px">
    <el-input type="textarea" rows="10" input-style="height: 200px;resize:none;" v-model="importAndExportContent"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="importMessageBoxVisible = false">关闭</el-button>
        <el-button type="primary" @click="importPlugin()">
          导入
        </el-button>
      </span>
    </template>
  </el-dialog>
  <k-layout class="page-blockly">
    <template #header>
        Blockly - {{store.blockly.filter((v)=>v.id?.toString()===currentId?.toString())?.[0]?.name ?? '主页'}} {{saving?'保存中...':''}}
    </template>
    <template #left>
      <div class="create" style="display: flex;flex-direction: row-reverse;padding-right: 10px;padding-top: 10px">
        <i @click="create()" style="cursor: pointer;padding-right: 5px"><new-file/></i>
        <i @click="importMessageBoxVisible=true;importAndExportContent=''" style="cursor: pointer;padding-right: 20px"><import-icon/></i>
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
import { ElMessageBox } from 'element-plus'
import NewFile from "./icons/new-file.vue";
import {gzip,ungzip} from 'pako'
import {stringToArrayBuffer} from "./utils";
import {ElDialog} from 'element-plus'
import ImportIcon from "./icons/import.vue"

const exportMessageBoxVisible = ref(false)
const importMessageBoxVisible = ref(false)
const importAndExportContent = ref('')

const editor = ref(null)
const currentId = ref(undefined)
const loading = ref(false)
let oldCurrentId = {value:undefined}
const init=ref(false);
const saving=ref(false);
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
    exportMessageBoxVisible.value = true
    const name = store.blockly.filter((v)=>v.id?.toString()==currentId.value)[0]?.name
    importAndExportContent.value = `插件名称: ${name}\n导出时间: ${new Date().toLocaleString()}\n-=-=-=-=--=-=-=-=- BEGIN BLOCKLY BLOCK -=-=--=-=-=--=-=--=-=-=-\n${btoa(String.fromCharCode.apply(null, gzip(JSON.stringify({body:editor.value.save(),name})))).replace(/(.{64})/g, "$1\n")}\n-=-=--=-=-=--=-=-=-=- END BLOCKLY BLOCK -=-=--=-=-=--=-=--=-=-=-`
  }
}
async function importPlugin(){
  if(importAndExportContent.value.length==0)return;
  const data_body = importAndExportContent.value.match(/-=-=-=-=--=-=-=-=-\s+BEGIN BLOCKLY BLOCK\s+-=-=--=-=-=--=-=--=-=-=-\n([\s\S]*)\n-=-=--=-=-=--=-=-=-=-\s+END BLOCKLY BLOCK\s+-=-=--=-=-=--=-=--=-=-=-/)?.[1]
    .replace(/[\r\n\t ]/g,'')
  if(!data_body)return;
  const data = JSON.parse(String.fromCharCode.apply(null, ungzip(stringToArrayBuffer(atob(data_body)))))
  if(!data)return;
  const id = await send('create-blockly-block')
  await send('save-blockly-block',id,data)
  importMessageBoxVisible.value=false
  currentId.value = id.toString()
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
