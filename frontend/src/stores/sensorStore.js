import { defineStore } from "pinia";
import {ref} from 'vue'

export const sensorStore=defineStore('sensorStore',()=>{
    const sensorData=ref({})
    const sensorValue=()=>sensorData.value
    const fetchData=async (online = '')=>{  
        const url = online ? `/data?online=${encodeURIComponent(online)}` : '/data'
        const respond=await fetch(url)
        const json=await respond.json()
        sensorData.value=json
    }
    return {sensorData,fetchData,sensorValue}
})