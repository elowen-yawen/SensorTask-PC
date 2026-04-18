<template>
  <div>
    <div class="first">
      <span>全局指令配置</span>
      <DirectData :storeData="store.data" :renderData="store.renderData" :handleUpdateData="store.handleUpdateData"
        :fetchDirectData="store.fetchDirectData" :handleRender="store.handleRender" :id="'null'" />
    </div>

    <div class="last">
      <span>多设备指令配置</span>

      <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link">
          电车编号ID: {{ selectedDeviceId || '请选择设备' }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="id in ids" :key="id" :command="id">
              {{ id }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div class="container">
        <DirectData v-if="selectedDeviceId" :storeData="store.data" :renderData="store.renderData"
          :handleUpdateData="store.handleUpdateData" :fetchDirectData="store.fetchDirectData"
          :handleRender="store.handleRender" :id="selectedDeviceId" />
        <div v-else style="padding: 20px;">选择设备以配置指令</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DirectData from '../components/DirectData.vue'
import { directStore } from '@/stores/directStore'
import { deviceStore } from '@/stores/deviceStore' 
import { computed, ref, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const store = directStore()
const dStore = deviceStore() 

const selectedDeviceId = ref(null)
const ids = computed(() => dStore.ids || [])


const handleCommand = (command) => {
  selectedDeviceId.value = command
}

onMounted(async () => {
  await dStore.fetchDeviceData({ currentPage: 1, pageSize: 999 })
})
</script>

<style scoped>
.first,
.last {
  font-weight: bold;
  font-size: 15px;
}

.first>span,
.last>span {
  font-size: 18px;
}

.container {
  padding-top: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  font-weight: normal;
  margin-left: 10px;
}
</style>