import { createRouter, createWebHistory } from "vue-router";
import homePage from '../pages/homePage.vue'
import behaviorInfo from "../pages/behaviorInfo.vue";
import errHistory from "../pages/errHistory.vue";
import historyInfo from '../pages/historyInfo.vue';
import deviceInfo from '../pages/deviceInfo.vue'
import directPage from "../pages/directPage.vue";
import behaviorRealTime from '../pages/behaviorRealTime.vue'
const routes = [
    {path:'/',redirect:'/home'},
    {path:'/home',component:homePage,name:'home'},
    {path:'/history-info',component:historyInfo,name:'historyInfo'},
    {path:'/behavior-info',component:behaviorInfo,name:'behaviorInfo'},
    {path:'/err-info',component:errHistory,name:'err-info'},
    {path:'/device-info',component:deviceInfo,name:'deviceInfo'},
    {path:'/direct-info',component:directPage,name:'directInfo'},
    {path:'/behavior-real',component:behaviorRealTime,name:'behaviorReal'}

]

const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router