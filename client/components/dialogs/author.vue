<script setup lang="ts">
import {computed, ref, watch} from "vue";

const content = ref({
  name: '',
  email: ''
})

const model = defineProps(["modelValue"])

const $emit = defineEmits(['update:modelValue','callback'])

const visible = ref<any>(false)

function execute(){
  if(!content.value.name || !content.value.email){
    return
  }
  if(!content.value.name.match(/^[A-Za-z0-9_-]+$/)){
    alert('作者名称只能包含英文、数字、下划线和中划线')
    return
  }
  if(!content.value.email.match(/^[A-Za-z0-9_-]+@[A-Za-z0-9_\-.]+$/)){
    alert('作者邮箱格式不正确')
    return
  }
  $emit('update:modelValue',false)
  $emit('callback',content.value.name+'<'+content.value.email+'>')
  content.value.name = undefined
  content.value.email = undefined
}

watch(model,(newValue)=>{
  visible.value = !!model.modelValue;
  const regex = /^([A-Za-z0-9_-]+)<([A-Za-z0-9_-]+@[A-Za-z0-9_\-.]+)>$/
  const match = regex.exec(model.modelValue)
  if(match){
    content.value.name = match[1]
    content.value.email = match[2]
  }
});

watch(visible,(newValue)=>{
  $emit('update:modelValue',newValue?newValue:undefined)
})




</script>
<template>
  <el-dialog v-model="visible" title="设置作者">
    <el-input v-model="content.name" placeholder="作者名称(请使用英文名称)" ></el-input>
    <el-input v-model="content.email" placeholder="作者邮箱"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:modelValue')">关闭</el-button>
        <el-button type="primary" @click="execute()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
