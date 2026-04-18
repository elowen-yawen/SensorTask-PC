import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const directStore = defineStore('directStore', () => {
  const data = ref([])
  const renderData = ref([])

  const fetchDirectData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/directData')
      if (res.data.success) {
        data.value = res.data.data
        console.log('[Store] 结构数据加载成功:', data.value.length);
      }
    } catch (err) {
      console.error('[Store] fetchDirectData 结构数据加载失败:', err)
    }
  }

  const handleRender = async (d_no = 'null') => {
    try {
      console.log(`[Store] 发送 /directRender 请求, d_no: ${d_no}`);
      const response = await axios.get('http://localhost:3000/directRender', {
        params: { d_no }
      })

      if (response.data.success) {
        renderData.value = response.data.data || []
        console.log(`[Store] 接收到 ${d_no} 的渲染数据量:`, renderData.value.length);
        return response.data.data || [];
      }
      return [];
    } catch (err) {
      console.error('[Store] handleRender 渲染数据请求失败:', err)
      return [];
    }
  }

  const handleUpdateData = async ({ id, value, d_no = 'null' }) => {
    try {
      const payload = {
        config_id: id,
        value: value,
        d_no: d_no
      };
      console.log(`[Store] 发送更新请求 /multipleDirectData:`, payload);
      const response = await axios.post('http://localhost:3000/multipleDirectData', payload)
      console.log(`[Store] 更新成功响应:`, response.data);
      return response
    } catch (err) {
      console.error('[Store] handleUpdateData 更新失败:', err)
      throw err
    }
  }

  return { data, renderData, fetchDirectData, handleUpdateData, handleRender }
})