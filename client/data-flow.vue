<template>
  <div style="height: 100%;width: 100%">
    <div style="width: 100%;padding: 5px;padding-left: 20px;height:25px">
      <button class="menu-button">退出编辑模式</button>
      </div>
    <div style="width:100%;height: 100%"><div style="height: 100%;" ref="baklava_workspace"></div></div>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref,unref} from "vue";

const baklava_workspace = ref(null)
import {createBaklava} from "baklavajs/dist/esm/bundle";
import "@baklavajs/themes/dist/classic.css"
import {Nodes} from "./nodes";

onMounted(()=>{
  const baklava = createBaklava(unref(baklava_workspace))
  console.info(baklava)
  Nodes.forEach(t=>baklava.editor.registerNodeType(t[0],{category:t[1]}))
})

</script>

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
