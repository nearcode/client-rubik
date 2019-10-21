<template>
    <div class="container">
        <el-row class="tac" :gutter="20">
            <el-col :span="4" style="margin-bottom: 10px;padding-right: 0">
                <v-sidebar></v-sidebar>
            </el-col>
            <el-col :span="20" style="margin-bottom: 20px;">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import vSidebar from "./sidebar.vue";

    export default {
        name: "account",
        components: {
            vSidebar
        },
    }
</script>

<style scoped>

</style>