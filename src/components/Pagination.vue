<template>
    <el-pagination
            v-model:current-page="this.currentPage"
            v-model:page-size="this.pageSize"
            :page-sizes="[1, 10, 30, 100]"
            :small="true"
            :disabled="false"
            :background="true"
            layout="sizes, prev, pager, next"
            :total="this.pageCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
    />
</template>

<script>
import {inject, defineEmits, ref} from "vue";

export default {
    name: "Pagination",
    setup(props, {emit}) {
        let pageSize = ref(10)
        let pageCount = inject("pageCount")
        let currentPage = ref(1)

        function handleCurrentChange(page) {
            emit('reset', {page: page, size: pageSize.value})
        }

        function handleSizeChange(size) {
            emit('reset', {page: 1, size: size})
        }

        return {
            pageSize,
            pageCount,
            currentPage,
            handleCurrentChange,
            handleSizeChange
        }
    },
}
</script>

<style scoped>

</style>