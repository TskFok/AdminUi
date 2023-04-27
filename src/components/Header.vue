<template>
    <el-menu
            class="el-menu-demo"
            mode="horizontal"
            active-text-color="#ffd04b"
            @select="handleSelect"
    >
        <el-menu-item index="1" disabled>welcome</el-menu-item>
        <div class="flex-grow"/>
        <el-menu-item index="2">退出</el-menu-item>
    </el-menu>
</template>

<script>
import {ElNotification} from "element-plus";
import router from "@/plugins/router";

export default {
    name: "Header",
    beforeCreate() {
        if (!localStorage.getItem("token")) {
            ElNotification({
                title: "登陆失效",
                message: "请重新登陆",
                type: 'error',
            })

            router.push("/login")
        }
    },
    methods: {
        handleSelect(key) {
            switch (key) {
                case "2":
                    localStorage.removeItem("token")
                    router.push("/login")
                    break
            }
        }
    }
}
</script>

<style scoped>
.flex-grow {
    flex-grow: 1;
}
</style>