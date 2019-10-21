<template>
    <div class="block">
        <el-carousel trigger="click" :interval="5000" :height="bannerHeight+'px'">
            <el-carousel-item v-for="(v,k) in banners" :key="k">
                <a href="javaScript:;">
                    <img width="100%" ref="image" :src="v.url" alt="" @load="imageLoaded">
                </a>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import baseApi from "@/api/base"

    export default {
        name: "home",
        data() {
            return {
                bannerHeight: 500,
                banners:[]
                // imgList: [
                //     {id: 0, idView: require('@/assets/pai.jpg')},
                //     {id: 1, name: '详情', idView: require('@/assets/pai.jpg')},
                //     {id: 2, name: '推荐', idView: require('@/assets/pai.jpg')}
                // ]
            }
        },
        computed: {
            // ...mapState(['banners']),
        },
        // 默认加载
        mounted() {
            this.getData();
            //图片高度随窗口高度变化
            window.addEventListener('resize', () => {
                this.imageLoaded(this.$refs.image);
            }, false);
        },
        methods: {
            async getData(){
                this.banners =this.$common.getJsonData(localStorage.banners) || [];
                
                try{
                    let result = await baseApi.getBanners();
                    this.banners= result.data;
                    localStorage.setItem('banners',JSON.stringify(this.banners));
                }catch(e){

                }
            },
            // 默认获取图片的高度
            imageLoaded() {
               if(!this.$refs.image) return;
                   this.$refs.image.forEach((item, index) => {
                       let bannerHeight = this.$refs.image[index].height;

                       if (bannerHeight && bannerHeight != 0) {

                           return this.bannerHeight = this.$refs.image[index].height;
                       }
                   })

            },
        }
    }
</script>

<style scoped>

</style>