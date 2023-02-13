<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue'
import {Terminal} from 'xterm'
import 'xterm/css/xterm.css'
const props = defineProps([
  'blocklyInformation',
  'current'
])
const terminal = new Terminal();
const terminalRef = ref(null)

const logger = {
  log:(...args)=>{
    terminal.writeln(args.join(' '))
  },
  error:(...args)=>{
    terminal.writeln('\x1B[1;1;30m['+ (new Date).toLocaleString() +'] \x1B[1;1;31m'+args.join(' ')+'\x1B[0m')
  },
  warn:(...args)=>{
    terminal.writeln('\x1B[1;1;30m['+ (new Date).toLocaleString() +'] \x1B[1;1;33m'+args.join(' ')+'\x1B[0m')
  },
  success:(...args)=>{
    terminal.writeln('\x1B[1;1;30m['+ (new Date).toLocaleString() +'] \x1B[1;1;32m'+args.join(' ')+'\x1B[0m')
  },
  info:(...args)=>{
    terminal.writeln('\x1B[1;1;30m['+ (new Date).toLocaleString() +'] \x1B[1;1;32m'+args.join(' ')+'\x1B[0m')
  },
  clear:()=>{
    terminal.clear()
  }
}
onMounted(()=>{
  terminal.open(terminalRef.value)
  logger.info("请点击左侧\"编译插件\"开始编译")
})

defineExpose({
  logger
})
</script>
<template>
  <div ref="terminalRef"></div>
</template>

