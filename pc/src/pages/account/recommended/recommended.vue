<template>
  <div class="At_the_bottom recommend">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>推荐计划</span>
      </div>

      <div class="text item">
        <h1 class="title">将推荐给您的朋友</h1>

        <el-row>
          <el-col :span="12" style="border-right: 1px solid #ddd;">
            <ul class="warning_list">
              <li>1.对于每一个您推荐来的用户，我们将奖励您，具体奖励见公告。</li>
              <li>2.我们将为您单独生成一个链接，您可将此链接分享给您的朋友用以注册。系统将标识使用此链接注册的用户是您所推荐的。</li>
              <li>3.不允许传播任何误导消息或作出任何有损 {{webTitle | noData}} 品牌的行为。</li>
              <li>4.对于滥用此推荐奖励机制的账户，我们将做冻结处理，且不会提前发出通知。</li>
            </ul>
          </el-col>
          <el-col :span="12">
            <div class="recommend_link">
              <p>您已阅读并同意了我们的使用条款和先决条件</p>
              <img :src="urlAction+'?text='+referrerUrl" style="padding: 5px;" width="145" alt />
              <div>
                <span class="line">{{referrerUrl}}</span>
                <el-button type="primary" @click="copy(referrerUrl)">复制</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <div style="padding: 18px 0;font-weight: bold">
          <span>介绍的用户及奖励</span>
        </div>
        <el-table :data="resultList" ref="table" border v-loading="loading">
           <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
          <el-table-column label="账户" prop="username"></el-table-column>
          <el-table-column label="奖励" align="right">
            <template slot-scope="scope">￥{{scope.row.profit || 0}}</template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="totalItems>1">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :page-size="20"
            layout="prev, pager, next"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import baseApi from "@/api/base";
import config from "@/config";
import { mapState } from "vuex";

export default {
  name: "bank",
  data() {
    return {
      loading: false,
      resultList: [],
      referrerUrl: null,
      totalItems: 0,
      currentPage: 1,
      urlAction: config.baseUrl + "/qrcode"
    };
  },
  computed: {
    ...mapState(["webTitle", "uid"])
  },
  mounted() {
    this.referrerUrl =
      document.location.protocol + "//" + document.domain + "/r/" + this.uid;
    this.getData();
  },
  methods: {
    // 获取列表
    async getData() {
      try {
        let data = {
          p: this.currentPage
        };
        let result = await baseApi.getReferrer(data);
        this.resultList = result.data;
        this.totalItems = result.count;
        console.log(result);
      } catch (e) {}
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend {
  h1.title {
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    padding: 15px;
  }
  .warning_list {
    padding: 0 10px;
    li {
      padding: 10px;
      text-align: justify;
    }
  }
  .recommend_link {
    text-align: center;
    .line {
      display: inline-block;
    //   border: 1px solid $--border-color-lighter;
      padding: 8px 15px;
      line-height: 1;
      border-radius: 3px;
    }
  }
}
</style>