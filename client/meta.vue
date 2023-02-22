<script setup lang="ts">
import {computed, ref,watch} from "vue";
import {store} from "@koishijs/client";
import * as Blockly from "blockly";
import AuthorDialog from './components/dialogs/author.vue'
import {workspaces} from "blockly/core/serialization";
import {WorkspaceSvg} from "blockly";
import {deduplicate} from "cosmokit";

const $emit = defineEmits(['update:workspace','metaChange'])

const props : {workspace?:WorkspaceSvg,current?:any} = defineProps(['current','workspace'])

const commandBlocks = ref([])

const blockUUID = computed(()=>store.blockly.find(t=>t.id.toString() === props.current?.toString()))
const meta = ref({
  author:undefined,
  description:"",
  commands:{},
  tables:{}
})

function checkBlocks(this:WorkspaceSvg){
  commandBlocks.value = []
  this.getAllBlocks(false).forEach(block=>{
    if(block.type === 'command'){
      commandBlocks.value.push(block)
    }
  })
}

try{
  Blockly.serialization.registry.unregister('plugin-meta')
  Blockly.serialization.registry.register('plugin-meta',{
    save(){
      return meta.value
    },
    load(state:any,workspace) {
      if(!state)return
      meta.value.author = state.author
      meta.value.description = state.description ?? undefined
      workspace['metaListener'] = checkBlocks.bind(workspace)
      workspace.addChangeListener(workspace['metaListener'])
      workspace['metaListener']();
      meta.value.commands = state.commands??{};
      meta.value.tables = state.tables??{};
    },
    clear(workspace) {
      meta.value.description = ''
      meta.value.author = undefined
      workspace.removeChangeListener(workspace['metaListener'])
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
  const table = prompt('请输入数据表名')
  if(!table)return
  meta.value.tables[table] = {
    columns:{}
  }
}

const commandBlockNames = computed(()=>commandBlocks.value.map(t=>t.getFieldValue('name')))

const mergedCommandBlockNames = computed(()=>deduplicate([...commandBlockNames.value,...Object.keys(meta.value.commands)]))


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
        <el-table v-model="meta.tables">
          <el-table-column prop="table" label="数据表名" width="180" />
          <el-table-column prop="columns" label="字段" width="180" />
          <el-table-column prop="operation" label="操作" />
        </el-table>
        <h2>指令</h2>
        <div>
          <div v-for="(command,i) in mergedCommandBlockNames">
            <h3 :class="commandBlockNames.includes(command)?'':'disabled-title'">{{command}} <el-button v-if="meta.commands[command]" @click="delete meta.commands[command]">删除</el-button></h3>
            <k-button v-if="!meta.commands[command]" @click="meta.commands[command]={authority:0}">设置指令信息</k-button>
            <template v-else>
              <el-input type="textarea" v-model="meta.commands[command].description"></el-input>
              最低权限等级<el-input-number v-model="meta.commands[command].authority"></el-input-number>
            </template>
          </div>
        </div>
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
.disabled-title{
  color:var(--fg3);
}
</style>
