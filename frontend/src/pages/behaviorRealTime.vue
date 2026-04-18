<template>
  <div>
    <div class="card-chart-wrapper">
      <div class="card-container-wrapper">
        <CardContainer :data="store.paginationData||[]" />
      </div>

      <div class="chart-wrapper">
        <LineBar :data="store.paginationData||[]"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted } from 'vue'
import CardContainer from '../components/CardContainer.vue'
import {paginationStore} from '../stores/paginationStore'
const store=paginationStore()
onMounted(async () => {
  await store.fetchPaginationData()
  console.log("pagination"+store.paginationData)

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
  flex: 2; 
  min-width: 300px;
}

</style>
