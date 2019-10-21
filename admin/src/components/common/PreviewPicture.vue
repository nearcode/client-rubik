<template>
    <div>
        <el-dialog :visible.sync="showPhoto" title="图片预览" center  append-to-body>
            <img width="100%" :src="photo" :alt="photo">
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PreviewPicture",
        props: [ 'photo'],
        data(){
            return{
                showPhoto:false,
                param: '',
                parent: null,
            }
        },

        methods: {
            init(parent) {
                // this.param = '';
                this.parent = parent;
            },
            show(datas) {
                this.$nextTick(() => {
                    // this.authType = datas.authType;
                    this.showPhoto = true;
                });
                // this.callback = datas.callback;
                // this.cancelCall = datas.cancel;
            },
        }
    }
</script>

<style scoped>
</style>
