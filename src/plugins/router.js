import {createRouter, createWebHashHistory} from 'vue-router'
import Login from "@/views/Login.vue";
import Default from "@/views/Default.vue";
import Home from "@/views/Home.vue";
import User from "@/views/User.vue";
import Corpus from "@/views/Corpus.vue";
import CorpusVicuna from "@/views/CorpusVicuna.vue";

//路由数组
const routes = [
    {
        path: "/",
        name: "default",
        component: Default,
        children: []
    },
    {
        path: "/login",
        name: "login",
        component: Login,
        children: []
    },
    {
        path: "/home",
        name: "home",
        component: Home,
        children: []
    },
    {
        path: "/user",
        name: "user",
        component: User,
        children: []
    },
    {
        path: "/corpus",
        name: "corpus",
        component: Corpus,
        children: []
    },
    {
        path: "/corpus-vicuna",
        name: "corpus-vicuna",
        component: CorpusVicuna,
        children: []
    },
]

//路由对象
const router = createRouter({
    history: createWebHashHistory(),
    routes //上面的路由数组
})

//导出路由对象，在main.js中引用
export default router