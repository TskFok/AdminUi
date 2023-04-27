<template>

</template>

<script>
import router from "@/plugins/router";

export default {
    name: "Default",
    beforeCreate() {
        if (localStorage.getItem("token")) {
            router.push("/home")
        } else {
            router.push("/login")
        }
    }
}
</script>

<style scoped>

</style>