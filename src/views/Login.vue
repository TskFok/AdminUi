<template>
    <div class="main main-login">
        <div class="form-login">
            <el-row>
                <el-col class="form-login" :span="16" :offset="4">
                    <el-form-item label="邮箱">
                        <el-input v-model="email"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="form-login" :span="16" :offset="4">
                    <el-form-item label="密码">
                        <el-input type="password" v-model="password"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="form-login" :span="6" :offset="16">
                    <el-button @click="send">登陆</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import SendRequest from "@/plugins/axiosInstance";
import {ElNotification} from "element-plus";
import router from "@/plugins/router";

export default {
    name: "Login",
    data() {
        return {
            email: "",
            password: ""
        }
    },
    methods: {
        send() {
            SendRequest({
                method: 'post',
                url: '/login',
                data: {
                    email: this.email,
                    password: this.password
                },
            }).then((resp) => {
                ElNotification({
                    title: "请求成功",
                    message: "登陆成功",
                    type: 'success',
                })

                localStorage.setItem("token", resp.data)
                router.push("/home")
            }).catch((err) => {
                ElNotification({
                    title: "请求失败",
                    message: err.response.data,
                    type: 'error',
                })
            });
        }
    }
}
</script>

<style scoped>
.main-login {
    margin-left: 33.5%;
    margin-top: 15%;
    border-radius: 4px;
    border: 1px solid;
    height: 300px;
    width: 400px;
    background-color: aliceblue;
}

.form-login {
    margin-top: 7%;
}

</style>