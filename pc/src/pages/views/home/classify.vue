<template>
  <el-dialog
    :title="'币种分类'"
    :close-on-click-modal="false"
    :visible.sync="showDialog"
    width="1000px"
  >
    <el-collapse v-model="activeName" accordion  v-if="active==1">
      <el-collapse-item v-for="(v,k) in resultList" :key="k" :title="v.base" :name="k">
          <template slot="title">
            <span style="font-weight: bold;font-size:18px;">{{v.base}} ({{v.coins.length}})</span>
            </template>

          <el-row :gutter="12" style="margin-top:10px!important;">
          <el-col :span="6" style="cursor: pointer;margin-bottom:10px;" v-for="(val,key) in v.coins" :key="key">
            <el-card shadow="always">
               <div style="display:flex;align-items: center;height:50px">
                    <span style="flex:none;width:25px;height:25px;display:inline-block;margin-right:5px;">
                        <img style="width:100%;height:100%;display:block;" :src="getCoinIcon(val.coin)" alt="1">
                    </span>
                    <div>
                        <h1>{{val.coin}}</h1>
                        <p class="time"  style="color:#909399;">{{val.content}}</p>
                    </div>
               </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-if="active==2">
      <el-tab-pane :label="v.base" v-for="(v,k) in resultList" :key="k" :name="k">
           <span slot="label">{{v.base}} ({{v.coins.length}})</span>
        
        <el-row :gutter="12"  v-if="true" style="margin-top:10px!important;">
          <el-col :span="6" style="cursor: pointer;margin-bottom:10px;" v-for="(val,key) in v.coins" :key="key">
            <el-card shadow="always" style="height:128px;">
               <div style="display:flex;align-items: center;height:50px;border-bottom:1px solid #EBEEF5;margin-bottom:5px;">
                    <span style="flex:none;width:25px;height:25px;display:inline-block;margin-right:5px;">
                        <img style="width:100%" :src="getCoinIcon(val.coin)" alt>
                    </span>
                    <div >
                        <h1 style="font-size:18px;">{{val.coin}}</h1>
                        <p class="time"  style="color:#909399;">{{val.content}}</p>
                    </div>
               </div>
               <p :title="val.content" style="color:#909399;font-size:12px;word-break: break-all; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;">Bitcoin是点对点的基 </p>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
<!-- 
  <el-row :gutter="12"  v-if="true" style="margin-top:10px!important;">
          <el-col :xs="24" :sm="12" :md="8" style="cursor: pointer;margin-bottom:10px;" v-for="(val,key) in resultList" :key="key">
      <el-card shadow="always" style="height:128px;">
               <div slot="header" class="clearfix">
                  <span>{{val.base}}</span>
                </div>
               <p :title="val.content" style="color:#909399;font-size:12px;">Bitcoin是点对点的基 </p>
            </el-card>
          </el-col>
  </el-row> -->

    <span slot="footer" class="dialog-footer">
      <el-button type="primary">确 定</el-button>
      <el-button @click="showDialog=false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import baseApi from "@/api/base";
import { mapState } from "vuex";

export default {
  props: ["code"],
  data() {
    return {
      activeName:1,
      active:2,
      showDialog: true,
      loading:false,
      resultList: [{
          base: "平台币",
          coins: [
            {
              coin: "BTC",
              content: "比特币"
            },
            {
              coin: "ETH",
              content: "以太坊"
            },
             {
              coin: "NTK",
              content: "神经网络"
            },
          ]
        },
        {
          base: "游戏币",
          coins: [
            {
              coin: "EOS",
              content: "EOS"
            },
            {
              coin: "EUC",
              content: "艺游宝"
            }
          ]
        }
      ]
    };
  },
  mounted() {
      for(let item in this.coins){
          this.resultList[0].coins.push({
              coin:item,
              content:this.coins[item].chineseName
          });
      }
  },
    // 计算属性
  computed: {
    ...mapState(["coins",])
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  }
};
</script>

<style lang="less" scoped>
.iconCoin {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: sub;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.el-row{
    margin-top: 15px;
}
</style>
