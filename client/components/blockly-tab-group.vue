<template>
  <template v-for="(item, key) in data" :key="key">
    <blockly-tab-item v-model="model" :label="item" :value="key" v-if="filter ? filter(key) : true">
      <slot v-bind="{id:item}"></slot>
    </blockly-tab-item>
  </template>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import blocklyTabItem from './blockly-tab-item.vue'
const props = defineProps<{
  data: object
  modelValue: string
  filter?: (item: any) => boolean
}>()
console.info(props.data)
const emits = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: val => emits('update:modelValue', val),
})
</script>

<style lang="scss">
.k-tab-group-title {
  line-height: 2.25rem;
  padding: 0 2rem !important;
  font-weight: bold;
}
.k-tab-group-title:not(.k-select-item) {
  margin-top: 0.5rem;
}
</style>
