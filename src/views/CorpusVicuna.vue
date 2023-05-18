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
                <el-dialog v-model="dialogItemFormVisible" title="新增语料">
                    <el-form :model="formItem">
                        <el-form-item label="语料" :label-width="40">
                            <el-input v-model="formItem.corpus" autocomplete="off"/>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogItemFormVisible = false">取消</el-button>
                            <el-button @click="createItem(detailId)" type="primary">
                              确认
                            </el-button>
                        </span>
                    </template>
                </el-dialog>
                <el-drawer
                        v-model="table"
                        title="子物料"
                        direction="rtl"
                        size="50%"
                >
                    <el-col :offset="22">
                        <el-button type="primary" @click="dialogItemFormVisible = true">新增</el-button>
                    </el-col>
                    <el-table :data="gridData">
                        <el-table-column property="corpus" label="语料" width="450"/>
                        <el-table-column property="created_at" label="创建时间" width="150"/>
                        <el-table-column property="updated_at" label="结束时间" width="150"/>
                        <el-table-column fixed="right" label="操作" width="150">
                            <template #default="scopeItem">
                                <el-button size="small" @click="handleItemEdit(scopeItem.$index, scopeItem.row, detailId)"
                                >修改
                                </el-button
                                >
                                <el-button
                                        size="small"
                                        type="danger"
                                        @click="handleItemDelete(scopeItem.$index, scopeItem.row, detailId)"
                                >删除
                                </el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-drawer>
                <el-main>
                    <el-table :data="this.dataList" border height="450" max-height="550">
                        <el-table-column prop="id" label="Id" width="80"/>
                        <el-table-column prop="corpus" label="语料" width="880"/>
                        <el-table-column prop="created_at" label="创建时间" width="150"/>
                        <el-table-column prop="updated_at" label="修改时间" width="150"/>
                        <el-table-column label="操作" fixed="right" width="200">
                            <template #default="scope">
                                <el-button size="small" type="success" @click="handleInfo(scope.$index, scope.row)"
                                >详情
                                </el-button
                                >
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
    name: "CorpusVicuna",
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
        let gridData = ref([])
        let table = ref(false)

        provide('pageCount', count)
        provide('active', "3")

        let dialogFormVisible = ref(false)
        let dialogItemFormVisible = ref(false)

        const form = reactive({
            corpus: '',
        })

        const formItem = reactive({
            corpus: ""
        })

        async function send(page, size) {
            let result = await SendRequest({
                method: 'GET',
                url: '/corpus-vicuna?page=' + page + '&size=' + size,
                headers: {
                    token: localStorage.getItem("token")
                },
            })

            return result.data
        }

        function handleDelete(index, row) {
            SendRequest({
                method: 'DELETE',
                url: '/corpus-vicuna/' + row.id,
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
                    url: '/corpus-vicuna',
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

        let detailId = ref(0)

        function handleInfo(index, row) {
            detailId.value = row.id
            SendRequest({
                method: 'GET',
                url: '/corpus-vicuna/detail?id=' + row.id,
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                gridData.value = res.data
                table.value = true
            }).catch((err) => {
                ElMessage({
                    type: 'info',
                    message: '请求失败',
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
                url: '/corpus-vicuna',
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

        function addItem() {
            dialogItemFormVisible.value = true
        }

        function createItem(id) {
            SendRequest({
                method: 'POST',
                url: '/corpus-vicuna',
                data: {
                    "corpus": formItem.corpus,
                    "pid": id
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
                dialogItemFormVisible.value = false
                resetItem(id)
                formItem.corpus = ""
            }).catch((err) => {
                console.log(err)
                ElMessage({
                    type: 'info',
                    message: '新增语料失败',
                })
            })
        }

        function resetItem(id) {
            SendRequest({
                method: 'GET',
                url: '/corpus-vicuna/detail?id=' + id,
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                gridData.value = res.data
                table.value = true
            }).catch((err) => {
                ElMessage({
                    type: 'info',
                    message: '请求失败',
                })
            })
        }

        function handleItemEdit(index, row, detailId) {
            ElMessageBox.prompt('输入新的语料', '修改语料', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
            }).then(({value}) => {
                SendRequest({
                    method: 'PUT',
                    url: '/corpus-vicuna',
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
                    resetItem(detailId)
                }).catch((err) => {
                    ElMessage({
                        type: 'info',
                        message: '修改语料失败',
                    })
                })
            })
        }

        function handleItemDelete(index, row, detailId) {
            SendRequest({
                method: 'DELETE',
                url: '/corpus-vicuna/' + row.id,
                headers: {
                    token: localStorage.getItem("token")
                },
            }).then((res) => {
                ElNotification({
                    title: "请求成功",
                    message: "删除成功",
                    type: 'success',
                })
                resetItem(detailId)
            }).catch((err) => {
                ElMessage({
                    type: 'info',
                    message: '删除语料失败',
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
            createIt,
            handleInfo,
            gridData,
            table,
            addItem,
            dialogItemFormVisible,
            detailId,
            createItem,
            formItem,
            handleItemEdit,
            handleItemDelete
        }
    }
}
</script>

<style scoped>
</style>