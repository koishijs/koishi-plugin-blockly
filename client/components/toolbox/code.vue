<script setup lang="ts">
import {defineProps} from 'vue'
const props = defineProps([
  'blocklyInformation',
  'current'
])
</script>
<template>
  <div style="width: 100%;overflow: hidden">
    {{blocklyInformation.code}}
  </div>
</template>

