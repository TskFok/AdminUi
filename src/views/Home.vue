<template>
    <el-container class="main">
        <el-header>
            <Header/>
        </el-header>
        <el-container>
            <el-aside>
                <Aside/>
            </el-aside>
            <el-main>
                <p>CPU</p>
                <el-table :data="dataList.cpu" border height="120" max-height="550">
                    <el-table-column prop="coreId" label="coreId" width="141"/>
                    <el-table-column prop="cpu" label="cpu" width="242"/>
                    <el-table-column prop="family" label="family" width="242"/>
                    <el-table-column prop="modelName" label="modelName" width="545"/>
                </el-table>

                <p>内存</p>
                <el-table :data="dataList.memory" border height="80" max-height="550">
                    <el-table-column prop="free" label="空闲" width="389"/>
                    <el-table-column prop="total" label="全部" width="390"/>
                    <el-table-column prop="used_percent" label="已使用" width="391"/>
                </el-table>

                <p>Host</p>
                <el-table :data="dataList.host" border height="80" max-height="550">
                    <el-table-column prop="hostname" label="hostname" width="227"/>
                    <el-table-column prop="os" label="平台" width="235"/>
                    <el-table-column prop="platform" label="系统" width="235"/>
                    <el-table-column prop="platformVersion" label="版本" width="236"/>
                    <el-table-column prop="kernelArch" label="架构" width="237"/>
                </el-table>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import {provide, reactive} from "vue";
import SendRequest from "@/plugins/axiosInstance";
import {ElNotification} from "element-plus";
import router from "@/plugins/router";

export default {
    name: "Home",
    components: {Aside, Header},
    beforeCreate() {
        this.send().then((res) => {
            this.dataList.cpu = res.cpu
            this.dataList.memory = res.memory
            this.dataList.host = res.host
        }).catch((err) => {
            ElNotification({
                title: "请求失败",
                message: err.response.data,
                type: 'error',
            })
            if (err.response.status === 401) {
                localStorage.removeItem("token")
                router.push("/login")
            }
        })
    },
    setup() {
        provide('active', "0")

        let dataList = reactive({
            cpu: [],
            host: [],
            memory: [],
        })

        async function send() {
            let result = await SendRequest({
                method: 'GET',
                url: '/home',
                headers: {
                    token: localStorage.getItem("token")
                },
            })

            return result.data
        }

        return {
            send,
            dataList
        }
    }
}
</script>

<style scoped>
</style>