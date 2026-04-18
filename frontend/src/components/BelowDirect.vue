<template>
    <div>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                电车编号id<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="id in ids" :command="id" @click="send(id)">{{ id }}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <div class="container">
            <DirectData :id="d_no"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import DirectData from '../components/DirectData.vue'
import {deviceStore} from '../stores/deviceStore'
import {ref,computed,onMounted} from 'vue'
const handleCommand = (command: string | number | object) => {
    ElMessage(`click on item ${command}`)
}
const d_no=ref()
const store=deviceStore()
const ids=computed(()=>store.ids)
const send=(id)=>{
    d_no.value=Number(id);
}
onMounted(()=>
    
)
</script>

<style scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>
