<template>
    <div>  
        <realTimeInfoTable />
        <div class="chartContainer">
            <LineBar :data="data" :pageSize="pageSize"/>
        </div>
    </div>
</template>

<script setup>
import realTimeInfoTable from '../components/realTimeInfoTable.vue'
import LineBar from '../components/LineBar.vue'
import {paginationStore} from '../stores/paginationStore'
import {onMounted,computed} from "vue"
const store=paginationStore()
const data=computed(()=>store.paginationData||[])
const pageSize=computed(()=>store.pageSize||5)

onMounted(async()=>{
    await store.fetchPaginationData()
})
</script>

<style scoped>
.chartContainer{
    padding-top:10px;
}
</style>