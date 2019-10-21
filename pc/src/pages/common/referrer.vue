<template>
    <div class="At_the_bottom">

    </div>
</template>

<script>
    export default {
        name: "referrer",

        mounted(){
            sessionStorage.referrer = sessionStorage.referrer = this.$route.params.id;
            this.$router.push('/');
        }
    }
</script>

<style scoped>

</style>