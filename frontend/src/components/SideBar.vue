<template>
  <div class="container">
    <el-aside width="200px" class="custom-aside">
      <el-menu router :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen"
        @close="handleClose">

        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <Odometer />
            </el-icon>
            <span>传感器数据</span>
          </template>
          <el-menu-item-group style="padding-top:5px" title="Sensor Data">
            <el-menu-item index="/home" @click="setType('传感器实时数据')">
              <el-icon>
                <Promotion />
              </el-icon>
              <router-link to="/home">实时数据</router-link>
            </el-menu-item>
            <el-menu-item index="/history-info" @click="setType('传感器历史数据')">
              <el-icon>
                <Histogram />
              </el-icon>
              <router-link to="/historyInfo">历史数据</router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Location />
            </el-icon>
            <span>行为数据</span>
          </template>
          <el-menu-item-group style="padding-top:5px" title="Behavior Data">
            <el-menu-item index="/behavior-real" @click="setType('行为历史数据')">
              <el-icon>
                <Promotion />
              </el-icon>
              <router-link to="/behavior-real">实时数据</router-link>
            </el-menu-item>
            <el-menu-item index="/behavior-info" @click="setType('行为实时数据')">
              <el-icon>
                <Histogram />
              </el-icon>
              <router-link to="/behavior-info">历史数据</router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <View />
            </el-icon>
            <span>设备数据</span>
          </template>
          <el-menu-item-group style="padding-top:5px" title="Settings">
            <el-menu-item index="/device-info" @click="setType('设备管理中心')">
              <el-icon>
                <Grid />
              </el-icon>
              <router-link to="/device-info">设备管理</router-link>
            </el-menu-item>
            <el-menu-item index="direct-info">
              <el-icon>
                <Setting />
              </el-icon>
              <router-link to="/directInfo">设备设置</router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="/err-info" @click="setType('故障数据监测')">
          <el-icon>
            <Document />
          </el-icon>
          <router-link to="/err-info">故障记录</router-link>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </div>
</template>

<script lang="ts" setup>
import {
  Location,
  Grid,
  Document,
  Setting,
  View,
  Odometer,
  Promotion,
  Histogram
} from '@element-plus/icons-vue'
import { paginationStore } from '../stores/paginationStore'

const store = paginationStore()
const setType = (val) => {
  store.type = val
}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.container {
  width: 250px;
  height: auto;
}

.custom-aside {
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  height: auto;
}

.el-menu-item a {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
