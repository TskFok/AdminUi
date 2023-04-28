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
                    <el-dialog v-model="dialogFormVisible" title="新增语料">
                        <el-form :model="form">
                            <el-form-item label="语料" :label-width="40">
                                <el-input v-model="form.corpus" autocomplete="off"/>
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
                        <el-table-column prop="id" label="Id" width="40"/>
                        <el-table-column prop="corpus" label="语料" width="880"/>
                        <el-table-column prop="created_at" label="创建时间" width="150"/>
                        <el-table-column prop="updated_at" label="修改时间" width="150"/>
                        <el-table-column label="操作" fixed="right" width="150">
                            <template #default="scope">
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                                >修改
                                </el-button
                                >
                                <el-button
                                        size="small"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)"
                                >删除
                                </el-button
                                >
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
import Pagination from "@/components/Pagination.vue";
import {provide, reactive, ref} from "vue";
import SendRequest from "@/plugins/axiosInstance";
import Title from "@/components/Title.vue";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import router from "@/plugins/router";

export default {
    name: "Corpus",
    components: {Title, Pagination, Header, Aside},
    beforeCreate() {
        this.send(1, 10).then((res) => {
            this.dataList = res.data_list
            this.count = res.count
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
        provide('active', "2")

        let dialogFormVisible = ref(false)

        const form = reactive({
            corpus: '',
        })

        async function send(page, size) {
            let result = await SendRequest({
                method: 'GET',
                url: '/corpus?page=' + page + '&size=' + size,
                headers: {
                    token: localStorage.getItem("token")
                },
            })

            return result.data
        }

        function handleDelete(index, row) {
            SendRequest({
                method: 'DELETE',
                url: '/corpus/' + row.id,
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                ElNotification({
                    title: "请求成功",
                    message: "删除成功",
                    type: 'success',
                })
                resetList({page: 1, size: 10})
            }).catch((err) => {
                ElMessage({
                    type: 'info',
                    message: '删除语料失败',
                })
            })
        }

        function handleEdit(index, row) {
            ElMessageBox.prompt('输入新的语料', '修改语料', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
            }).then(({value}) => {
                SendRequest({
                    method: 'PUT',
                    url: '/corpus',
                    data: {
                        "corpus": value,
                        "id": row.id
                    },
                    headers: {
                        token: localStorage.getItem("token")
                    },
                }).then((res) => {
                    ElNotification({
                        title: "请求成功",
                        message: "修改成功",
                        type: 'success',
                    })
                    resetList({page: 1, size: 10})
                }).catch((err) => {
                    ElMessage({
                        type: 'info',
                        message: '修改语料失败',
                    })
                })
            })
        }

        function resetList(obj) {
            send(obj.page, obj.size).then((res) => {
                //不能修改count,会导致重新触发handleCurrentChange
                dataList.value = res.data_list
            });
        }

        function openCreateForm(obj) {
            dialogFormVisible.value = true
        }

        function createIt() {
            SendRequest({
                method: 'POST',
                url: '/corpus',
                data: {
                    "corpus": form.corpus
                },
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                ElNotification({
                    title: "请求成功",
                    message: "新增成功",
                    type: 'success',
                })
                resetList({page: 1, size: 10})
                dialogFormVisible.value = false
                form.corpus = ""
            }).catch((err) => {
                console.log(err)
                ElMessage({
                    type: 'info',
                    message: '新增语料失败',
                })
            })
        }

        return {
            dataList,
            count,
            send,
            handleDelete,
            handleEdit,
            resetList,
            openCreateForm,
            dialogFormVisible,
            form,
            createIt
        }
    }
}
</script>

<style scoped>
</style>