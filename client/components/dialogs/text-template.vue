<template>
  <el-dialog v-model="dialogEnabled" title="编辑字符串模板">
    <el-row>
      <el-col :span="16">
        <el-scrollbar height="200px" style="border: 1px lightgray solid;border-radius: 5px" class="editor-context">
            <div contenteditable="true" style="min-height: 200px;" class="editor-content" ref="inputModel" @click="updateSelection">
            </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="8">
        <variable v-model="modelValue.variables" v-on:tag-click="insertVariable" v-on:tag-removed="tagRemoved"></variable>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, toRef, watch, Ref} from "vue";

  import Variable from "../variable.vue";

  const props = defineProps(['current','modelValue'])

  const $emits = defineEmits(['update:current','update:modelValue'])

  const dialogEnabled = computed({
    get:()=>props.current == 'text-template',
    set:(val)=>$emits('update:current',val?'text-template':undefined)
  })

  const modelValue = computed({
    get:()=>props.modelValue,
    set:(val)=>$emits('update:modelValue',val)
  })

  const inputModel : Ref<Element> = ref(null)


  function parseNode(node:Node,layer=0):string[]{
    if(node.nodeType == Node.TEXT_NODE){
      return [node.textContent]
    }
    if(node.nodeType == Node.ELEMENT_NODE){
      const element = node as HTMLElement
      if(element.className.includes("sp-tag")){
        return ["${"+element.innerText+"}"]
      }else if(element.tagName == "DIV"){
        if(layer++>=5)return;
        let text = []
        element.childNodes.forEach((node)=>{
          text.push(parseNode(node,layer))
        })
        return ["\n",text.join("")]
      }
    }
    return []
  }
  function updateModel(){
    const input = (inputModel.value.innerHTML as any)
      .replaceAll(/<!(-)+([^>]*)(-)+>/g,"")
    const element = document.createElement('div')
    element.innerHTML = input
    let text = []
    // Walk through the childnodes
    element.childNodes.forEach((node)=>{
      text.push(...parseNode(node))
    })
    modelValue.value.template = text.join("")
    updateSelection()
  }
  onMounted(()=>{
    const dispose = watch(inputModel,(target)=>{
      if(target==undefined)return;
      dispose()
      inputModel.value.addEventListener('input',()=>{
        updateModel()
      })
    })
  })
  watch(dialogEnabled,(state)=>{
    if(state){
      nextTick(()=>{
        console.info(modelValue)
        inputModel.value.innerHTML = (modelValue.value.template??"")
          .replaceAll(/\$\{([^}]+)}/g,"<span class='sp-tag' contenteditable='false'>$1</span>")
          .split("\n")
          .map((line)=>line.trim())
          .filter((line)=>line.length>0)
          .map((line)=>"<div>"+line+"</div>")
          .join("")
      })
    }
  })
  let selection = null
  function updateSelection(){
    if(!inputModel.value)return
    if(inputModel.value.contains(window.getSelection().focusNode))
    selection = window.getSelection().getRangeAt(0)
  }
  function insertVariable(name){
    const tagNode = document.createElement("span")
    tagNode.className = "sp-tag"
    tagNode.contentEditable = "false"
    tagNode.innerText = name
    selection.insertNode(tagNode)
    updateModel()
  }
  // If the tag deleted, remove the variable
  function tagRemoved(){
    const variables = modelValue.value.variables
    if(!inputModel)return;
    const tags = inputModel.value.querySelectorAll(".sp-tag")
    tags.forEach((tag)=>{
      if(tag.tagName!="SPAN")return;
      console.info(tag.innerHTML)
      if(!variables.includes(tag.innerHTML as any)){
        tag.remove()
      }
    })
    updateModel()
  }
  console.info(insertVariable)
</script>

<style>
  .editor-context > div > .el-scrollbar__view{
    min-height: 100%;
  }
  .editor-content{
    outline: none;
    min-height: 100%;
  }
  .sp-tag{
    background-color: orange;
    color: white;
    padding: 0 5px;
    margin:0 5px;
    border-radius: 5px;
    user-select: none;
  }
</style>
