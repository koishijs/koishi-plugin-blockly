<script setup lang="ts">
import {computed, ref,watch} from "vue";
import {store} from "@koishijs/client";
import * as Blockly from "blockly";
import AuthorDialog from './components/dialogs/author.vue'

const $emit = defineEmits(['update:workspace','metaChange'])

const props = defineProps(['current'])

const blockUUID = computed(()=>store.blockly.find(t=>t.id.toString() === props.current?.toString()))
const meta = ref({
  author:undefined,
  description:""
})
try{
  Blockly.serialization.registry.unregister('plugin-meta')
  Blockly.serialization.registry.register('plugin-meta',{
    save(){
      return meta.value
    },
    load(state:any) {
      if(!state)return
      meta.value.author = state.author
      meta.value.description = state.description ?? undefined
    },
    clear(workspace) {
      meta.value.description = ''
      meta.value.author = undefined
    },
    priority:10
  })
}catch(e){
  console.error(e)
}

function editAuthorCallback(e){
  meta.value.author = e
  $emit('metaChange')
}

watch(meta.value,()=>{
  $emit('metaChange')
})

const editAuthor = ref(undefined)

function createTable(){
  alert("暂未支持!")
}
</script>
<template>
  <author-dialog v-model="editAuthor" @callback="editAuthorCallback"></author-dialog>
  <div style="display: flex;flex-flow: column;contain: size;overflow: hidden;height:100%">
    <div style="width: 100%;padding: 5px;padding-left: 20px;height:25px;border-bottom: 1px solid var(--bg1)">
      <button class="menu-button" @click="$emit('update:workspace','blockly')">退出元数据编辑</button>
    </div>
    <el-scrollbar style="flex: auto">
      <div style="padding: 20px">
        <h2>插件基本信息</h2>
        <p>插件ID:{{props.current}}</p>
        <p>插件UUID: {{blockUUID?.uuid}}</p>
        <p>插件作者: {{meta.author??'未署名'}}<k-button @click="editAuthor = meta.author??true">修改</k-button></p>
        插件描述: <br><el-input type="textarea" v-model="meta.description"></el-input>
        <h2>数据库</h2>
        <el-button @click="createTable">新建数据表</el-button>
        <el-table>
          <el-table-column prop="table" label="数据表名" width="180" />
          <el-table-column prop="columns" label="字段" width="180" />
          <el-table-column prop="operation" label="操作" />
        </el-table>
        <h2>存储空间</h2>
        暂未支持
        <h2>其他信息</h2>
        SHA256校验值:
        <el-input model-value="96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e"></el-input>
      </div>
    </el-scrollbar>
  </div>
</template>

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
