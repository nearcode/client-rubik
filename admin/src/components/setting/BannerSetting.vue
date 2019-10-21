<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统配置</el-breadcrumb-item>
                <el-breadcrumb-item>Banner设置</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
                <!--<el-button icon="el-icon-download">导出</el-button>-->
                <!--</el-tooltip>-->
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <el-upload
                class="upload-demo"
                :action="urlAction"
                :on-preview="handlePreview"
                :on-success="handleAvatarSuccess"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :file-list="resultList"
                list-type="picture">
                <el-button size="small" type="primary" :disabled="getPerms('sysSettings:banner:add')">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">图片大小尺寸需一致，否则显示可能不美观或显示不全 (点击列表可预览图片)</div>
            </el-upload>
        </div>
        <showPhoto ref="previewsfz" :photo="photo"></showPhoto>
    </div>
</template>

<script>
    import showPhoto from "src/components/common/PreviewPicture";
    import config from "@/config";
    import adminApi from "@/api/admin";

    export default {
        name: "BannerSetting",
        components: {
            showPhoto
        },
        data() {
            return {
                photo: '',
                imageUrl: [],
                urlAction: config.baseUrl + '/account/upload',
                resultList: [],
                base64: ''
            };
        },
        mounted() {
          this.getData();
        },
        methods: {
            async getData() {
                try{
                    let result = await adminApi.bannerList();
                 
                    let data=[];
                    let list = result.data;
                    for (let i in list) {
                       data.push({
                            name: 'banner' + (parseFloat(i)+1),
                            url: list[i].url,
                            id:list[i]._id
                        })
                    }
                    this.resultList=data
                }catch(e){

                }
              
            },
            handleAvatarSuccess(res, files) {
                // let datas=[];
                // // let file=URL.createObjectURL(files.raw);
                // this.imageUrl.push({
                //     // name:files.name,
                //     url:res.attachment_url
                // })
                // datas.push(res.data);
                this.imageUrl=res.data;
                this.submit(this.imageUrl)
            },
            async submit(url) {
                try {
                    let result = await adminApi.addBanner(url);
                    this.$message.success('上传成功');
                 
                }catch (e) {
                    
                }
                this.getData();
            },
            async handleRemove(file, fileList) {
                // let data = [];
                // for (let i in fileList) {
                //     data.push(fileList[i].url)
                // }

                try {
                    let result = await adminApi.delBanner(file.id);
                  
                    this.$message.success('删除成功');
                }catch (e) {
                   
                }
                 this.getData();
            },
            // 预览图片
            showImgs(url) {
                if (!url) return;
                this.photo = url;
                this.$refs.previewsfz.show()
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handlePreview(file) {
                this.showImgs(file.url);
            }
        }
    }
</script>

<style scoped>

</style>
