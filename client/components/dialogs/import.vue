<script setup lang="ts">
  import {ref,watch} from "vue";

  const content = ref("")

  const model = defineProps(["modelValue"])

  const $emit = defineEmits(['update:modelValue','callback'])

  const visible = ref<any>(false)


  function execute(){
    $emit('update:modelValue',false)
    $emit('callback',content.value)
    content.value = ''
  }

  watch(model,(newValue)=>{
    visible.value = model.modelValue;
  });

  watch(visible,(newValue)=>{
    $emit('update:modelValue',newValue)
  })
</script>
<template>
  <el-dialog v-model="visible" title="导入插件" width="700px">
    <el-input type="textarea" rows="10" input-style="height: 200px;resize:none;" v-model="content"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:modelValue')">关闭</el-button>
        <el-button type="primary" @click="execute()">
          导入
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
