<template>
    <el-container class="main">
        <el-header>
            <Header/>
        </el-header>
        <el-container>
            <el-aside>
                <Aside/>
            </el-aside>
            <el-container>
                <el-header>
                    <Title @add="openCreateForm"/>
                    <el-dialog v-model="dialogFormVisible" title="新建用户">
                        <el-form :model="form">
                            <el-form-item label="邮箱" :label-width="40">
                                <el-input v-model="form.email" autocomplete="off"/>
                            </el-form-item>
                            <el-form-item label="密码" :label-width="40">
                                <el-input v-model="form.password" type="password" autocomplete="off"/>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                          <span class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取消</el-button>
                            <el-button type="primary" @click="createIt">
                              确认
                            </el-button>
                          </span>
                        </template>
                    </el-dialog>
                </el-header>
                <el-main>
                    <el-table :data="this.dataList" border height="450" max-height="550">
                        <el-table-column prop="id" label="Id" width="120"/>
                        <el-table-column prop="email" label="邮箱" width="220"/>
                        <el-table-column prop="created_at" label="创建时间" width="220"/>
                        <el-table-column prop="updated_at" label="修改时间" width="220"/>
                        <el-table-column :formatter="statusMap" prop="status" label="用户状态" width="220"/>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <template v-if="scope.row.status === 1">
                                    <el-button
                                            size="small"
                                            type="danger"
                                            @click="handleStop(scope.$index, scope.row)"
                                    >禁用
                                    </el-button>
                                </template>
                                <template v-else>
                                    <el-button
                                            size="small"
                                            type="danger"
                                            @click="handleStart(scope.$index, scope.row)"
                                    >启用
                                    </el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer>
                    <Pagination @reset="resetList"/>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";
import SendRequest from "@/plugins/axiosInstance";
import Pagination from "@/components/Pagination.vue";
import {provide, reactive, ref} from "vue";
import {ElNotification} from "element-plus";
import router from "@/plugins/router";
import Title from "@/components/Title.vue";

export default {
    name: "User",
    beforeCreate() {
        this.send(1, 10).then((res) => {
            this.count = res.count
            this.dataList = res.data_list
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
        });
    },
    setup() {
        let dataList = ref([])
        let count = ref(0)

        provide('pageCount', count)
        provide('active', "1")

        let dialogFormVisible = ref(false)
        let form = reactive({
            email: "",
            password: ""
        })

        function statusMap(row, column) {
            if (row.status === 1) {
                return "启用"
            } else {
                return "禁用"
            }
        }

        async function send(page, size) {
            let result = await SendRequest({
                method: 'GET',
                url: '/user?page=' + page + '&size=' + size,
                headers: {
                    token: localStorage.getItem("token")
                },
            })

            return result.data
        }

        function handleStop(index, row) {
            SendRequest({
                method: 'PUT',
                url: '/user/status',
                data: {
                    "id": row.id,
                },
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                resetList({page: 1, size: 10})
            }).catch((err) => {
                ElNotification({
                    title: "请求失败",
                    message: err.response.data,
                    type: 'error',
                })
            })
        }

        function handleStart(index, row) {
            SendRequest({
                method: 'PUT',
                url: '/user/status',
                data: {
                    "id": row.id,
                },
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                resetList({page: 1, size: 10})
            }).catch((err) => {
                ElNotification({
                    title: "请求失败",
                    message: err.response.data,
                    type: 'error',
                })
            })
        }

        function resetList(obj) {
            send(obj.page, obj.size).then((res) => {
                //不能修改count,会导致重新触发handleCurrentChange
                dataList.value = res.data_list
            });
        }

        function openCreateForm() {
            dialogFormVisible.value = true
        }

        function createIt() {
            SendRequest({
                method: 'POST',
                url: '/user',
                data: {
                    "email": form.email,
                    "password": form.password
                },
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                dialogFormVisible.value = false
            }).catch((err) => {
                ElNotification({
                    title: "请求失败",
                    message: err.response.data,
                    type: 'error',
                })
            })
        }

        return {
            dataList,
            count,
            send,
            resetList,
            openCreateForm,
            dialogFormVisible,
            form,
            createIt,
            handleStop,
            handleStart,
            statusMap
        }
    },
    components: {Title, Pagination, Header, Aside},
}
</script>

<style scoped>

</style>