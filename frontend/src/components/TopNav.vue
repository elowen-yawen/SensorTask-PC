<template>
    <div class="top">
        <h2>{{ title}}</h2>
    </div>
</template>
<script setup>
import { inject, ref, computed } from 'vue'
const injectedTitle = inject('currentType', ref('数据监测中心'))
const title = computed(() => injectedTitle.value || '数据监测中心')//第二个参数是默认值
</script>

<style scoped>
.top {
    width: 100%;
    display: block;
    height: 40px;
    background-color: skyblue;
    text-align: center;
}

.top h2 {
    margin: 0;
    padding: 0;
    line-height: 40px;
    color: white;
}
</style>