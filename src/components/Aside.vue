<template>
    <el-col>
        <el-menu
                active-text-color="#ffd04b"
                :default-active="active"
                @select="handleSelect"
                class="el-menu-vertical-demo"
        >
            <el-menu-item index="0">
                <el-icon>
                    <House/>
                </el-icon>
                <span>首页</span>
            </el-menu-item>
            <el-menu-item index="1">
                <el-icon>
                    <Avatar/>
                </el-icon>
                <span>用户</span>
            </el-menu-item>
            <el-menu-item index="2">
                <el-icon>
                    <document/>
                </el-icon>
                <span>语料库</span>
            </el-menu-item>
        </el-menu>
    </el-col>
</template>

<script>
import router from "@/plugins/router";
import {inject} from "vue";
import {House} from "@element-plus/icons-vue";

export default {
    name: "Aside",
    components: {House},
    setup() {
        let active = inject('active')

        return {
            active
        }
    },
    methods: {
        handleSelect(key) {
            switch (key) {
                case "0":
                    router.push('/home')
                    break
                case "1":
                    router.push('/user')
                    break
                case "2":
                    router.push('/corpus')
                    break
            }
        }
    }
}
</script>

<style scoped>

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 660px;
}

</style>