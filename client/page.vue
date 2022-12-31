<template>
  <k-layout>
    <template #left>
      <div style="height: 60%">
        <el-scrollbar>
          <k-button style="width: 100%;height:48px" @click="">创建插件</k-button>
          <k-tab-group :data="Object.fromEntries(store.blockly.map(t=>[t.id+'-'+t.name,{id:t.id}]))" v-model="currentId"></k-tab-group>
        </el-scrollbar>
      </div>
      <hr/>
      <div style="height: 40%;padding:10px">
        <k-button>应用更改</k-button>
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
      console.info(r,s);
      loading.value=true;
      if(s!=undefined)await send('save-blockly',s.split('-')[0],editor.value.save())
      const data = await send("load-blockly",r.split('-')[0]);
      loading.value=false;
      await nextTick(()=>{
        oldCurrentId = currentId;
        editor.value.load(data);
      })
    })
  })
setTimeout(()=>init.value=false,500);
</script>
