<template>
  <div class="table">
    <div class="input">
      <form @submit.prevent>
        <el-input v-model="keyword" style="width: 240px" placeholder="输入设备编号" :suffix-icon="Search" />
        <div class="block">
          <el-date-picker v-model="value" type="datetimerange" start-placeholder="Start date" end-placeholder="End date"
            format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss"
            style="margin-left:30px;" />
        </div>
        <el-button type="primary" @click="handleSearch"
          style="background-color: skyblue; color: white; margin-left: 20px">
          开始查找
        </el-button>

      </form>
    </div>

    <table>
      <thead>
        <tr>
          <th v-for="col in headers" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in store.errData" :key="idx">
          <td v-for="col in headers" :key="col">{{ row[col] }}</td>
        </tr>
        <tr v-if="store.errData.length === 0">
          <td :colspan="headers.length || 1">暂无错误数据</td>
        </tr>
      </tbody>
    </table>


    <div class="demo-pagination-block">
      <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
        layout="sizes, prev, pager, next" :total="store.total || 0" @size-change="handlePageSizeChange"
        @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { errMsgStore } from "../stores/errMsgStore";
import { Search } from "@element-plus/icons-vue";

const store = errMsgStore();

// 本地分页参数
const currentPage = ref(1);
const pageSize = ref(5);
const keyword = ref("");
const value=ref("")

// 表头动态生成
const headers = computed(() => {
  const data = store.errData;
  return data.length ? Object.keys(data[0]) : [];
});

// 搜索函数
const handleSearch = async (page = 1) => {
  // 使用本组件的 store，传入正确的参数名
  await store.fetchErrData({
    currentPage: page,
    pageSize: pageSize.value,
    keyword: keyword.value,
    startTime: value.value?.[0] || null,
    endTime: value.value?.[1] || null
  });
};

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  handleSearch(page);
};

const handlePageSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
  handleSearch(1);
};

// 页面加载默认获取
onMounted(async () => {
  await store.fetchErrData({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  });
});
</script>

<style scoped>
.table {
  background: white;
  border-radius: 6px;
  border: 1px solid #e3f2fd;
  padding: 16px;
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
</style>
