<template>
  <div class="At_the_bottom" style="width:100%">
    <el-card class="box-card" shadow="never" v-loading="!coin">
      <div slot="header" class="clearfix">
        <div class="info_header">
          <img :src="getCoinIcon(coin)" class="coin_icon" alt />
          <div style="display: inline-block;margin-left: 10px;">
            <h1 style="font-size: 20px;">
              {{coins[coin] | getDictValue('chineseName','--')}}
              <small>({{coin | noData}})</small>
            </h1>
            <!--<p></p>-->
          </div>
        </div>
      </div>
      <div class="text item">
        <h1>币种简介</h1>
        <div class="content">
          <span v-if="coins[coin] && coins[coin].content" v-html="coins[coin].content"></span>
        </div>
      </div>
      <div class="text item">
        <h1>链接</h1>
        <div class="content" v-if="linksUrl">
          <el-button
            type="primary"
            v-for="(v,k) of linksUrl"
            :key="k"
            @click="goPath(v.split('|')[1])"
          >{{v.split('|')[0]}}</el-button>
        </div>
      </div>
      <div class="text item">
        <h1>技术参数</h1>
        <div class="content">
          <!-- <table cellspacing="0" cellpadding="0" class="table table-bordered">
                        <tbody>
                        <tr>
                            <td class="td_left">
                                中文名
                            </td>
                            <td class="td_right">
                                <span>{{coins[coin] | getDictValue('chineseName','--')}}</span>
                            </td>

                            <td class="td_left">
                                英文名
                            </td>

                            <td class="td_right">
                                <span>{{coins[coin] | getDictValue('chineseName','--')}}</span>
                            </td>

                            <td class="td_left">
                                英文简称
                            </td>
                            <td class="td_right">
                                <span>{{coins[coin] | getDictValue('alias','--')}}</span>
                            </td>
                        </tr>

                        <tr>
                            <td class="td_left">
                                开发者
                            </td>
                            <td class="td_right">
                                <span>{{coins[coin] | getDictValue('developer','--')}}</span>
                            </td>

                            <td class="td_left">
                                区块时间
                            </td>

                            <td class="td_right">
                                <span>{{coins[coin] | getDictValue('blockTime','--')}}</span>
                            </td>

                            <td class="td_left">
                                发布日期
                            </td>
                            <td class="td_right">
                                <span>{{coins[coin] | getDictValue('date','--')}}</span>
                            </td>
                        </tr>

                        <tr>
                            <td class="td_left" width="200">
                                核心算法
                            </td>
                            <td class="td_right">
                                <span>{{coins[coin] | getDictValue('algorithm','--')}}</span>
                            </td>

                            <td class="td_left" width="200">
                                货币总量
                            </td>

                            <td class="td_right">
                                <span>{{coins[coin] | getDictValue('quantum','--')}}</span>
                            </td>

                            <td class="td_left" width="200">

                            </td>
                            <td class="td_right">

                            </td>
                        </tr>

                        </tbody>
          </table>-->

          <p>
            中文名 ：
            <span
              :title="coins[coin] | getDictValue('chineseName','--')"
            >{{coins[coin] | getDictValue('chineseName','--')}}</span>
          </p>
          <p>
            英文名 :
            <span
              :title="coins[coin] | getDictValue('englishName','--')"
            >{{coins[coin] | getDictValue('englishName','--')}}</span>
          </p>
          <p>
            英文简称 :
            <span
              :title="coins[coin] | getDictValue('alias','--')"
            >{{coins[coin] | getDictValue('alias','--')}}</span>
          </p>
          <p>
            开发者 :
            <span
              :title="coins[coin] | getDictValue('developer','--')"
            >{{coins[coin] | getDictValue('developer','--')}}</span>
          </p>
          <p>
            区块时间 :
            <span
              :title="coins[coin] | getDictValue('blockTime','--')"
            >{{coins[coin] | getDictValue('blockTime','--')}}</span>
          </p>
          <p>
            发布日期 :
            <span
              :title="coins[coin] | getDictValue('date','--')"
            >{{coins[coin] | getDictValue('date','--')}}</span>
          </p>
          <p>
            核心算法 :
            <span
              :title="coins[coin] | getDictValue('algorithm','--')"
            >{{coins[coin] | getDictValue('algorithm','--')}}</span>
          </p>
          <p>
            货币总量 :
            <span
              :title="coins[coin] | getDictValue('quantum','--')"
            >{{coins[coin] | getDictValue('quantum','--')}}</span>
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Information",
  data() {
    return {};
  },
  props: ["pair"],
  watch: {
    pair(value) {
      if (value) {
        // console.error(this.pair)
      }
    }
  },
  created() {
    // this.$route.meta.title = '币种资料-' + this.$common.getCoin(this.pair);
  },
  computed: {
    ...mapState(["coins"]),
    linksUrl() {
      let str =
        this.coins[this.coin] &&
        this.coins[this.coin].links &&
        this.coins[this.coin].links;
      let strs = new Array(); //定义一数组
      strs = str && str.split(","); //字符分割
      return strs;
    },
    coin() {
      return this.$common.getCoin(this.pair);
    }
  },
  mounted() {},
  methods: {
    goPath(path) {
      if (!path) return;
      window.open(path);
    }
  }
};
</script>

<style lang="less" scoped>
.info_header {
  height: 50px;
  .coin_icon {
    height: 100%;
    overflow: hidden;
    vertical-align: middle;
  }
}

.item {
  min-height: 200px;
  h1 {
    font-weight: 700;
    font-size: 16px;
    line-height: 50px;
  }
  .content {

    min-height: 100px;
    text-align: justify;
    line-height: 2;
    padding: 15px;
  }
}

.table-bordered {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-collapse: collapse;

  tr {
    padding: 10px;
    td {
      width: 150px;
      border: 1px solid #dcdfe6;
      padding: 10px;
    }
    .td_left {
      background-color: #ebeef5;
      border-color: #dcdfe6;
    }
    .td_right {
      border-color: #dcdfe6;
      text-align: left;
    }
  }
}
</style>