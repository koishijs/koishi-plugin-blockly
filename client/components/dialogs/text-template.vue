<template>
  <el-dialog v-model="dialogEnabled">
    <el-row>
      <el-col :span="16">
        <el-scrollbar height="200px" style="border: 1px lightgray solid;border-radius: 5px" class="editor-context">
            <div contenteditable="true" style="min-height: 200px;" class="editor-content">
              <div>
                早上好，
                <el-tag contenteditable="false" color="orange">用户名</el-tag>
              </div>
              <div>
                你今天赚到了<el-tag contenteditable="false" color="orange">积分</el-tag>个积分!
              </div>
            </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="8">
        <variable></variable>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
  import {computed} from "vue";
  import Variable from "../variable.vue";

  const props = defineProps(['current','modelValue'])

  const $emits = defineEmits(['update:current','update:modelValue'])

  const dialogEnabled = computed({
    get:()=>props.current == 'text-template',
    set:(val)=>$emits('update:current',val?'text-template':undefined)
  })
</script>

<style>
  .editor-context > div > .el-scrollbar__view{
    min-height: 100%;
  }
  .editor-content{
    outline: none;
    min-height: 100%;
  }
</style>
