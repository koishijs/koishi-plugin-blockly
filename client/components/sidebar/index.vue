<script setup lang="ts">
  import BlocklyTabGroup from '../blockly-tab-group.vue'
  import {computed} from "vue";
  import { store} from "@koishijs/client";
  import {ElMessageBox} from "element-plus";
  import ImportIcon from "../../icons/import.vue"
  import NewFile from "../../icons/new-file.vue";
  import {
    createBlockly as create,
    deletePlugin as __delete,
    enableBlockly,
    disableBlockly,
    renameBlockly as rename,
    exportPlugin as _export,
    buildBlockly as build,
    saveBlockly
  } from "../../api/manager";

  const props = defineProps(['blocks','workspace','dialog','current','panel','logger'])
  const $emit = defineEmits(['update:dialog','update:current'])

  const { panel,blocks } = props

  const current = computed({
    get:()=>props.current,
    set:(val)=>$emit('update:current',val)
  })

  const dialog = computed({
    get:()=>props.dialog,
    set:(val)=>$emit('update:dialog',val)
  })

  const buildBlockly = async ()=> {
    await saveBlockly(current.value,props.workspace)
    if (current.value == undefined) {
      return
    }
    const block = store.blockly.find(t=>t.id==current.value)
    const result = await build(current.value, block.name,block.uuid, props.workspace,props.logger.logger)
    if (result) {
      panel.code = result
    }
  }

  async function renameBlockly(){
    const name = prompt('输入重命名的插件名词','未命名Koishi插件')
    if(name!=null)
      await rename(current.value,name)
  }

  async function deleteBlockly() {
    if(current.value==undefined){
      return
    }
    if(await ElMessageBox.confirm("确定删除当前插件?") === 'confirm'){
      await __delete(current.value)
    }
  }

  async function exportBlockly(){
    if(current.value==undefined){
      return
    }
    const block = store.blockly.find(t=>t.id==current.value)
    const result = await _export(current.value, block.name,block.uuid,props.workspace)
    if(result){
      dialog.value.export = result
    }
  }

  async function createBlockly(){
    $emit('update:current',await create())
  }


</script>

<template>
  <div class="create" style="display: flex;flex-direction: row-reverse;padding-right: 10px;padding-top: 10px">
    <i @click="createBlockly" style="cursor: pointer;padding-right: 5px"><new-file/></i>
    <i @click="dialog.import=true" style="cursor: pointer;padding-right: 20px"><import-icon/></i>
  </div>
  <div class="list" style="height: 60%">
    <el-scrollbar>
      <blockly-tab-group :data="Object.fromEntries(store.blockly.map(t=>[t.id,t]))" v-model="current">
      </blockly-tab-group>
    </el-scrollbar>
  </div>
  <div style="height: 40%;padding:10px">
    <div v-if="current">
      <k-button @click="buildBlockly()">编译插件</k-button>
      <k-button @click="()=>enableBlockly(current)">启用插件</k-button>
      <k-button @click="()=>disableBlockly(current)">禁用插件</k-button>
      <k-button @click="renameBlockly()">重命名插件</k-button>
      <k-button @click="deleteBlockly()">删除插件</k-button>
      <k-button @click="exportBlockly()">导出插件</k-button>
    </div>
  </div>
</template>
