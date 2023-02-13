<script setup lang="ts">
import {defineProps} from 'vue'
import 'highlight.js/styles/stackoverflow-light.css'
import 'highlight.js/lib/common';
import HighlightVue from "@highlightjs/vue-plugin";
const HighLight = HighlightVue.component
const props = defineProps([
  'blocklyInformation',
  'current'
])
</script>
<template>
  <high-light :code="blocklyInformation.code"></high-light>
</template>

