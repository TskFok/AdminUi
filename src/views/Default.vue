<template>

</template>

<script>
import router from "@/plugins/router";

export default {
    name: "Default",
    beforeCreate() {
        router.push("/login")
    }
}
</script>

<style scoped>

</style>