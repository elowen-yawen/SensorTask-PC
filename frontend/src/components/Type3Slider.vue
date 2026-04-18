<template>
  <div style="padding: 0 10px; width: 250px">
    <el-slider
      :model-value="Number(modelValue || 0)"
      :min="Number(node.min || 0)"
      :max="Number(node.max || 100)"
      @input="val => $emit('update:modelValue', val)" 
      @change="val => $emit('save', val)"
    />
  </div>
</template>

<script setup>
defineProps({ node: Object, modelValue: [Number, String] })
defineEmits(['update:modelValue', 'save'])
</script>