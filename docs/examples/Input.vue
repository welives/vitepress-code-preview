<template>
  <input class="input" type="text" v-model="input" />
  <MoButton type="primary" @click="onSubmit">提交</MoButton>
  <div style="margin-top: 16px">输出内容：{{ content }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({ name: 'DemoInput' })
const input = ref()
const content = ref()

const onSubmit = () => {
  content.value = input.value
}
</script>

<style scoped>
.input {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  padding: 14px;
  width: 300px;
  font-size: 16px;
  margin-right: 16px;
}
</style>
