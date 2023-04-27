<template>
    <el-col :offset="22">
        <el-button type="primary" @click="add">新增</el-button>
    </el-col>
</template>

<script>

export default {
    name: "Title",
    setup(props, {emit}) {
        function add() {
            emit('add')
        }

        return {
            add
        }
    }
}
</script>

<style scoped>
.el-col {
    padding-top: 20px;
}
</style>