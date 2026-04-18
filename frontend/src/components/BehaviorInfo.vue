<template>
    <div>
        <div class="input">
            <form @submit.prevent>
                <el-input v-model="input" style="width: 240px;" placeholder="输入设备编号" :suffix-icon="Search" />
                <div class="block">
                    <el-date-picker v-model="value" type="datetimerange" start-placeholder="Start date"
                        end-placeholder="End date" format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd"
                        time-format="A hh:mm:ss" style="margin-left:30px;" />
                </div>
                <el-button type="primary" @click="handleSearch" :loading="paginationstore.loading"
                    style="background-color:skyblue;color:white;margin-left:20px">开始查找</el-button>
            </form>
        </div>

        <div style=" overflow: auto;" class="table">
            <table v-if="paginationstore.paginationData.length > 0">
                <thead>
                    <tr>
                        <th v-for="(value, key) in paginationstore.paginationData[0]" :key="key">
                            {{ key }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, rowIndex) in paginationstore.paginationData" :key="rowIndex">
                        <td v-for="(value, key, cellIndex) in item" :key="cellIndex">
                            {{ value }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else style="text-align: center; padding: 50px; color: #999;font-size:30px">
                {{ paginationstore.loading ? '加载中...' : '暂无数据' }}
            </div>
        </div>
        <div class="demo-pagination-block">
            <div class="demonstration"></div>
            <el-pagination v-model="currentPage" :page-size="pageSize" :page-sizes="[5,10,15,20]" :size="size"
                :disabled="disabled" :background="background" layout="sizes, prev, pager, next"
                :total="paginationstore.total" @size-change="handlePageSizeChange" @current-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { paginationStore } from '../stores/paginationStore'

const paginationstore = paginationStore()
const value = ref('')
const input = ref('')
const pageSize = ref(5)
const currentPage = ref(1)      
const disabled = ref(false);    
const background = ref(true);     
const handleSearch = async (page = 1) => {
    await paginationstore.fetchPaginationData({
        type:'behavior',
        currentPage:page,
        pageSize: pageSize.value,
        keyword: input.value,
        startTime: value.value?.[0],
        endTime: value.value?.[1]
    })
}

const handlePageChange = (page) => {
    handleSearch(page)
}

const handlePageSizeChange = (size) => {
    pageSize.value = size
    handleSearch(1) // 改变页大小时回到第1页
}

onMounted(() => {
    handleSearch(1)
})
// 点击开始查询，另外设置页码，换页，都会重新从后台拿数据handleSearch
</script>

<style scoped>
.input form {
    padding-bottom: 20px;
    display: flex;
}
.demo-pagination-block{
    margin-left:300px;
    margin-top:30px;
}
.demo-datetime-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: stretch;
}

.demo-datetime-picker .block {
    padding: 30px 0;
    text-align: center;
    min-width: 300px;
    flex: 1;
}

.table {
    background: white;
    border-radius: 6px;
    border: 1px solid #e3f2fd;
}

.table>table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    font-size: 14px;
}

.table th {
    background-color: #e3f2fd;
    color: #1976d2;
    font-weight: 500;
    padding: 12px 16px;
    border-bottom: 1px solid #bbdefb;
}

.table td {
    padding: 10px 16px;
    border-bottom: 1px solid #f5f5f5;
    color: #424242;
}

.table tbody tr:hover {
    background-color: #f8fdff;
}

.line {
    width: 1px;
    background-color: var(--el-border-color);
}

@media (max-width: 768px) {
    .demo-datetime-picker .block {
        flex: 100%;
        border-bottom: solid 1px var(--el-border-color);
    }

    .demo-datetime-picker .block:last-child {
        border-bottom: none;
    }

    .line {
        display: none;
    }

    :deep(.el-date-editor.el-input) {
        width: 100%;
    }

    :deep(.el-date-editor.el-input__wrapper) {
        width: 100%;
        max-width: 300px;
    }

    .table th,
    .table td {
        padding: 8px 12px;
    }
}
</style>