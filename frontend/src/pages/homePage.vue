<template>
    <div>
        <div class="card-chart-wrapper">
            <div class="card-container-wrapper">
                <CardContainer :data="store.sensorData?.proccessData || []" />
            </div>

            <div class="chart-wrapper">
                <LineBar :data="data"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { sensorStore } from '../stores/sensorStore'
import { computed, onMounted } from 'vue'
import CardContainer from '../components/CardContainer.vue'

const store = sensorStore()
const data=computed(()=>store.sensorData?.proccessData)
onMounted(async () => {
    await store.fetchData()
    console.log('数据：', store.sensorData)
})
</script>
<style>
.card-chart-wrapper {
  display: flex;
  gap: 10px;
}

.card-container-wrapper {
  flex: 1;
}

.chart-wrapper {
  flex: 2;  /* 图表占比大一点 */
  min-width: 300px; /* 防止图表太窄 */
}

</style>