<template>
  <div>
    <div class="input">
      <form @submit.prevent>
        <el-input v-model="input" placeholder="输入电车编号id或者设备名称" style="width: 240px" :suffix-icon="Search" />
        <el-button type="primary" :loading="store.loading" @click="handleSearch" class="search-btn">开始查找</el-button>
      </form>
      <el-button type="success" @click="showAddForm" class="add-btn">新增设备</el-button>
    </div>

    <div class="table">
      <table v-if="deviceData.length > 0">
        <thead>
          <tr>
            <th v-for="(val, key) in deviceData[0]" :key="key">{{ key }}</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in deviceData" :key="index">
            <td v-for="(val, key) in item" :key="key">{{ val }}</td>
            <td>
              <el-button type="primary" @click="showEditForm(item)">修改</el-button>
              <el-button type="danger" @click="handleDelete(item)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-table">
        {{ store.loading ? '加载中...' : '暂无数据' }}
      </div>
    </div>

    <!-- 新增面板 -->
    <div class="update" v-if="showAdd">
      <div class="modal-mask" @click="showAdd = false"></div>
      <el-card class="modal-container">
        <span class="close-btn" @click="showAdd = false">&times;</span>
        <template #header>
          <div class="card-header"><span>新增数据：</span></div>
        </template>

        <div v-for="(labelName, index) in labels" :key="index" class="form-row">
          <label :for="index">{{ labelName }}:</label>
          <input :id="index" v-model="formData[labelName]" />
        </div>

        <template #footer>
          <el-button type="success" native-type="button" @click="handleAdd">提交数据</el-button>
        </template>
      </el-card>
    </div>

    <!-- 修改面板 -->
    <div class="update" v-if="showEdit">
      <div class="modal-mask" @click="showEdit = false"></div>
      <el-card class="modal-container">
        <span class="close-btn" @click="showEdit = false">&times;</span>
        <template #header>
          <div class="card-header"><span>修改数据：</span></div>
        </template>

        <div v-for="(labelName, index) in labels" :key="index" class="form-row">
          <label :for="index">{{ labelName }}:</label>
          <input :id="index" v-model="editData[labelName]" />
        </div>

        <template #footer>
          <el-button type="warning" native-type="button" @click="handleUpdate">提交数据</el-button>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { deviceStore } from '../stores/deviceStore'
import { Search } from '@element-plus/icons-vue'

const store = deviceStore()
const input = ref('')
const formData = ref({})
const editData = ref({})
const oldId = ref(null)
const labels = ref(['id', '设备名称', '电车编号id', '备注'])
const showAdd = ref(false)
const showEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)

const deviceData = computed(() => store.deviceData)

const fetchData = async () => {
  store.loading = true
  try {
    await store.fetchDeviceData({ input: input.value, currentPage: currentPage.value, pageSize: pageSize.value })
  } finally {
    store.loading = false
  }
}

const resetForm = (form) => {
  labels.value.forEach(label => form[label] = '')
}

const handleSearch = async () => await fetchData()

const showAddForm = () => {
  showAdd.value = true
  showEdit.value = false
}

const handleAdd = async () => {
  if (!validateForm(formData.value)) return

  formData.value['创立时间'] = new Date().toLocaleString('zh-CN', { hour12: false })

  try {
    const res = await store.handleAdd(formData.value)
    if (res.data.success) {
      alert('添加成功')
      resetForm(formData.value)
      showAdd.value = false
      await fetchData()
    } else {
      alert('添加失败：' + (res.data.message || '未知错误'))
    }
  } catch (err) {
    console.error(err)
  }
}

const validateForm = (form) => {
  if (!form['id'] || isNaN(Number(form['id']))) { alert('id不能为空且必须为数字'); return false }
  if (!form['设备名称']) { alert('设备名称不能为空'); return false }
  if (!form['电车编号id']) { alert('电车编号id不能为空'); return false }
  if (store.deviceData.some(item => Number(item.id) === Number(form['id']) && form !== editData.value)) { alert('id已存在'); return false }
  return true
}

const handleDelete = async (item) => {
  if (!confirm('你真的要删除吗？')) return
  try {
    const res = await store.handleDelete(Number(item.id))
    if (res.data.success) await fetchData()
    else alert('删除失败：' + (res.data.message || '未知错误'))
  } catch (err) {
    console.error(err)
    alert('删除失败，请重试！')
  }
}

const showEditForm = (item) => {
  showEdit.value = true
  showAdd.value = false
  editData.value = { ...item, id: Number(item.id) }
  oldId.value = Number(item.id)
}

const handleUpdate = async () => {
  if (!validateForm(editData.value)) return

  const updatePayload = {
    ...editData.value,
    oldId: oldId.value,
    '备注': editData.value['备注'] ?? null,
    '设备名称': editData.value['设备名称'] ?? '',
    '电车编号id': editData.value['电车编号id'] ?? '',
    'id': Number(editData.value['id'])
  }

  try {
    const res = await store.handleUpdate(updatePayload)
    if (res.data.success) {
      alert('修改成功')
      showEdit.value = false
      await fetchData()
    } else alert('修改失败：' + (res.data.message || '未知错误'))
  } catch (err) {
    console.error(err)
    alert('网络错误，修改失败')
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.input {
  display: flex;
  position: relative;
  gap: 12px;
}

.search-btn {
  margin-left: 20px;
  background-color: skyblue;
  color: white;
}

.add-btn {
  position: absolute;
  right: 0;
}

.form-row {
  margin-bottom: 10px;
}

.table {
  margin-top: 20px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e3f2fd;
}

.table > table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
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

.table td button:nth-child(1) {
  color: #1976d2;
  background-color: #e3f2fd;
  border: 1px solid #bbdefb;
}

.table tbody tr:hover {
  background-color: #f8fdff;
}

.empty-table {
  text-align: center;
  padding: 50px;
  color: #999;
  font-size: 30px;
}

/* 模态弹窗遮罩层 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 模态弹窗居中容器 */
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  max-width: 480px;
  width: 90%;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.5);
  border-radius: 8px;
  background-color: #fff;
  overflow: hidden;
}

/* 右上角关闭叉 */
.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #f56c6c;
}
</style>
