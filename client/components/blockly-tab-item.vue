<template>
  <div class="k-tab-item k-menu-item"
       :class="{ active: value === modelValue }"
       @click="$emit('update:modelValue', value)">
    <slot>
      {{ label['name'] }}
      <span class="dot" :style="label['enabled']?'background-color:green':'background-color:red'"> </span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['update:modelValue'])
defineProps<{
  label: string
  value: string
  modelValue: string
}>()
</script>

<style lang="scss" scoped>
.k-tab-item {
  line-height: 2.25rem;
  padding: 0 2rem 0 4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &.active {
    background-color: var(--hover-bg);
  }
}
.dot{
  display: inline-block;
  width: 10px;
  height: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}
</style>
