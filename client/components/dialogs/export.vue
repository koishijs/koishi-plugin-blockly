<script setup lang="ts">
import {computed, ref, watch} from "vue";

  const content = ref(false)

  const model = defineProps(["modelValue"])

  const $emit = defineEmits(['update:modelValue'])

  watch(model,(newValue)=>{
    content.value = newValue.modelValue;
  });

  const text_content = computed(()=>content.value??'')
</script>
<template>
  <el-dialog v-model="content" title="导出插件" width="700px">
    <el-input type="textarea" rows="10" input-style="height: 200px;resize:none;" v-model="text_content" readonly></el-input>
  </el-dialog>
</template>
