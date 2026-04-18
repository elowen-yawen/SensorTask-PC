<template>
  <div class="dynamic-node">
    <div class="node-header">
      <component v-if="icons[node.id]" :is="icons[node.id]" class="icon" />
      <span class="node-title">{{ node.t_name }}</span>
    </div>

    <div class="node-component">
      <component :is="getComponent(node.f_type)" :node="node" :model-value="formData[node.id]"
        @update:modelValue="val => formData[node.id] = val" @change="val => $emit('update:modelValue', node.id, val)" />
    </div>

    <div class="node-children" v-if="matchedChildGroups.length">
      <div v-for="([refKey, children]) in matchedChildGroups" :key="refKey">
        <DynamicNode v-for="child in sortNodes(children)" :key="child.id" :node="child" :form-data="formData"
          :icons="icons" :id="props.id" @update:modelValue="(id, val) => $emit('update:modelValue', id, val)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, markRaw, defineAsyncComponent } from 'vue'

const props = defineProps({
  node: Object,
  formData: Object, 
  icons: Object,
  id: [Number, String] 
})

const emit = defineEmits(['update:modelValue'])

const compMap = markRaw({
  1: defineAsyncComponent(() => import('./Type1Select.vue')),
  2: defineAsyncComponent(() => import('./Type2Input.vue')),
  3: defineAsyncComponent(() => import('./Type3Slider.vue')),
  default: defineAsyncComponent(() => import('./TypeDefault.vue'))
})

const getComponent = (type) => compMap[type] || compMap.default

const match = (parentVal, refVal) => {compMap
  if (refVal === 'off&on') return true
  return String(parentVal) === String(refVal)
}

const matchedChildGroups = computed(() => {
  const val = props.formData[props.node.id] 
  const groups = props.node.children || {}
  return Object.entries(groups).filter(([refKey]) => match(val, refKey))
})//[ ["on", [...] ], ["off", [...] ] ]，entries是把对象转换为前面那样子的数组

const sortNodes = (nodes) => [...nodes].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
</script>

<style scoped>
.dynamic-node {
  margin-bottom: 15px;
  padding-left: 15px;
  border-left: 1px dashed #eee;
}

.node-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.node-title {
  font-weight: 500;
  margin-left: 5px;
}

.icon {
  width: 1em;
  height: 1em;
  color: #409eff;
}

.node-children {
  margin-top: 10px;
}
</style>