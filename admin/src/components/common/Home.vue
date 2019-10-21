<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
        
            <div class="content">
                <el-scrollbar style="height: 100%">
                    <!-- <v-crumbs></v-crumbs> -->
                    <transition name="move" mode="out-in">
                        <keep-alive :include="tagsList" :exclude="excludes">
                            <router-view></router-view>
                        </keep-alive>
                    </transition>
                </el-scrollbar>
            </div>
        </div>

    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import bus from '../../api/bus';
    import {mapState} from 'vuex'
    import Main from '@/router/main.js'
    // import vCrumbs from './crumbs';

    export default {
        data() {
            return {
                tagsList: [],
                excludes:[],
                collapse: false
            }
        },
        components: {
            vHead, vSidebar, vTags
            // ,vCrumbs
        },

        computed: {
            key() {
                return this.$route.path + Math.random();
            },
            ... mapState(['permissions']),
          
        },
        mounted() {
            let isLogin=this.$store.state.isLogin();
            if(!isLogin){
                localStorage.removeItem('token');
                this.$router.push('/login');
            }
            //
            //
            // let myRouter=this.$router;
            // myRouter.options.routes[0].children.splice(0,myRouter.options.routes[0].children.length);
            // let routes=myRouter.options.routes[0].children;
            // let data=this.permissions;
            //
            // for(let key in data){
            //     let path="";
            //     for (let i in data[key]){
            //         path='/'+key+'/'+i;
            //     }
            //     for (let item of Main){
            //         console.log(path)
            //         if(path==item.path){
            //             routes.push(item);
            //         }
            //     }
            // }
            //
            // console.error(myRouter)
            //
            // myRouter.addRoutes(routes)
        },
        created() {
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for (let i = 0, len = msg.length; i < len; i++) {
                    msg[i].name && arr.push(msg[i].name);
                }
                // console.log(arr)
                this.tagsList = arr;
            })
             bus.$on('excludes', msg => {
                 let arr = [];
                for (let i = 0, len = msg.length; i < len; i++) {
                    msg[i].name && arr.push(msg[i].name);
                }
               
               for(let item of ['c2cHistoy','Article']){
                     arr.push(item);
               }
               
                console.log(arr)
                this.excludes = arr;
             })
        }
    }
</script>
