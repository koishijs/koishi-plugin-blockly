<template>
  <div class="k-tab-item k-menu-item"
       :class="{ active: value === modelValue }"
       @click="$emit('update:modelValue', value)">
    <slot>
      {{ label.name }}
      <span :class="{ dot: true, enabled: label.enabled }"></span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { BlocklyMenuItem } from 'koishi-plugin-blockly'
defineEmits(['update:modelValue'])
defineProps<{
  label: BlocklyMenuItem
  value: string
  modelValue?: string
}>()
</script>

<style lang="scss" scoped>
.k-tab-item {
  display: flex;
  line-height: 2.25rem;
  padding: 0 2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: space-between;
  
  &.active {
    background-color: var(--hover-bg);
  }
}
$size: 8px;
.dot{
  display: inline-block;
  width: $size;
  height: $size;
  border-radius: $size;
  background-color: var(--danger);

  &.enabled {
    background-color: var(--success);
  }
}
</style>
