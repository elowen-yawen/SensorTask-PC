<template>
  <div>
    <h3>折线图与柱状图</h3>
    <div class="chart-container" ref="linechart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

const linechart = ref(null)
let mychart = null

const props = defineProps({
  data: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 5 }
})

// -------------------------
// 初始化图表
// -------------------------
const initChart = async () => {
  await nextTick()

  // 避免容器宽度为 0 的情况
  if (!linechart.value || linechart.value.offsetWidth === 0) {
    setTimeout(initChart, 50)
    return
  }

  if (!mychart) {
    mychart = window.echarts.init(linechart.value)
    window.addEventListener('resize', () => mychart?.resize())
  }

  updateChart(props.data)
}

// -------------------------
// 更新图表
// -------------------------
const updateChart = (source) => {
  try {
    const json = source?.slice(0, props.pageSize) || []

    if (!mychart) return

    if (json.length === 0) {
      mychart.setOption({
        title: { left: 'center', top: 'middle' }
      })
      return
    }

    const elemKeys = Object.keys(json[0])
    const exclude = ['id', '设备编号', '数据类型', '创立时间', '采集时间']
    const fields = elemKeys.filter(k => !exclude.includes(k))

    const times = json.map(item =>
      item['创立时间']
        ? new Date(item['创立时间']).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
        : '未知时间'
    )

    const series = fields.map(field => ({
      name: field,
      type: 'line',
      data: json.map(item => {
        const raw = item[field]
        if (!raw) return 0
        const num = parseFloat(raw.toString().replace(/[^\d.-]/g, ''))//提取纯数字
        return isNaN(num) ? 0 : num
      })
    }))

    mychart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: fields },
      toolbox: {
        feature: {
          magicType: { type: ['line', 'bar'] },
          restore: {},
          dataView: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: times,
        axisLabel: { rotate: 20, interval: 0 }
      },
      yAxis: { type: 'value' },
      series
    })
  } catch (err) {
    console.error('图表更新失败：', err)
  }
}

// -------------------------
// 监听 data 和 pageSize
// -------------------------
watch(
  () => [props.data, props.pageSize],
  () => {z
    if (mychart) {
      updateChart(props.data)
    }
  },
  { deep: true }
)

// -------------------------
// 生命周期
// -------------------------
onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  if (mychart) {
    mychart.dispose()
    mychart = null
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 320px;
  border-radius: 4px;
}
</style>
