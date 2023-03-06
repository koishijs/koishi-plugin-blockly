<template>
  <el-tag
    v-for="tag in dynamicTags"
    :key="tag"
    color="orange"
    closable
    :disable-transitions="false"
    @close="handleClose(tag)"
    @click="selectVariable(tag)"
    style="cursor:pointer"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    class="ml-1 w-20"
    size="small"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
    + New Tag
  </el-button>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, toRef} from 'vue'
import { ElInput } from 'element-plus'

const props = defineProps(['modelValue'])

const $emits = defineEmits(['update:modelValue','tag-click','tag-removed'])

const model = computed({
  get: () => props.modelValue ?? [],
  set: val => $emits('update:modelValue', val),
})


const inputValue = ref('')
const dynamicTags = model
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  $emits("tag-removed")
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

function selectVariable(tag){
  $emits('tag-click',tag)
}
</script>
