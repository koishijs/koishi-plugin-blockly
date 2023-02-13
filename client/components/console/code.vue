<script setup lang="ts">
import {defineProps} from 'vue'
import 'highlight.js/styles/stackoverflow-light.css'
import highlight from 'highlight.js/lib/common';
import HighlightJsRender from 'highlight.js/lib/languages/javascript'
highlight.registerLanguage("javascript",HighlightJsRender)
import HighlightVue from "@highlightjs/vue-plugin";
const HighLight = HighlightVue.component
const props = defineProps([
  'blocklyInformation',
  'current'
])
</script>
<template>
  <template v-if="blocklyInformation.code">
    <high-light :code="blocklyInformation.code" lang="javascript"></high-light>
  </template>
</template>

