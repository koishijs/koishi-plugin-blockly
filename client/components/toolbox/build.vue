<script setup lang="ts">
import {defineProps} from 'vue'
const props = defineProps([
  'blocklyInformation',
  'current'
])
</script>
<template>
  <div>
    <pre>{{blocklyInformation.build}}</pre>
  </div>
</template>

