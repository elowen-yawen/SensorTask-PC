<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

let dataList = ref([])
let options = ref([])
const selectedValue = ref('')

const formatValue = (key, value) => {
  if (key === '创立时间') return new Date(value).toLocaleString('zh-CN')
  return value
}

watch(
  () => props.data,
  (newVal) => {
    if (!Array.isArray(newVal) || !newVal.length) return

    dataList.value = newVal
    const firstKey = Object.keys(newVal[0])[0]
    options.value = newVal.map(item => ({
      value: item[firstKey],
      label: item[firstKey]
    }))

    selectedValue.value = newVal[0][firstKey]
  },
  { immediate: true }
)
const filteredDataList = computed(() => {
  if (!dataList.value.length) return []

  const firstKey = Object.keys(dataList.value[0])[0]
  return dataList.value.filter(item => item[firstKey] === selectedValue.value)
})
</script>

<template>
  <div id="container">
    <el-select v-model="selectedValue" placeholder="请选择" style="margin-bottom: 20px; width: 200px;">
      <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>

    <div id="ul-wrapper">
      <div v-for="(obj, index) in filteredDataList" :key="index" class="data-card">
        <ul>
          <li v-for="(value, key) in obj" :key="key">
            <span class="key">{{ key }}：</span>
            <span class="val">{{ formatValue(key, value) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100%;
  display: block;
}

#ul-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.data-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  width: 250px;
  border: 1px solid rgba(33, 150, 243, 0.2);
  transition: all 0.3s ease;
}

.data-card li {
  display: flex;
  justify-content: space-between;
  line-height: 28px;
  border-bottom: 1px dashed #e0e0e0;
  padding: 4px 0;
}

ul {
  padding: 0px 5px;
}

.data-card li:last-child {
  border-bottom: none;
}

.key {
  color: #1976d2;
  font-weight: 500;
}

.val {
  color: #444;
}

.data-card li:first-child .val {
  color: #2196f3;
  font-weight: bold;
}
</style>
