<template>
  <div>
    <BehaviorInfo />
    <div class="chartContainer">
      <LineBar :data="data" :pageSize="pageSize"/>
    </div>
  </div>
</template>

<script setup>
import BehaviorInfo from '../components/BehaviorInfo.vue'
import LineBar from '../components/LineBar.vue'
import {paginationStore} from '../stores/paginationStore'
import {onMounted,computed} from 'vue'
const store=paginationStore()
const data=computed(()=>store.paginationData)
const pageSize=computed(()=>store.pageSize||5)
onMounted(async()=>{
  await store.paginationData()
})
</script>

<style scoped>
.chartContainer{
    padding-top:10px;
}</style>