<template>
  <el-container class="At_the_bottom panel">
    <section class="container">
      <el-card class="box-card" v-loading="loading" shadow="never">
        <el-table
          v-loading="loading"
          @row-click="showNews"
          ref="tickersTable"
          :data="resultList"
          style="width: 100%;cursor: pointer"
        >
          <template slot="empty">
            <i class="icon-no-data"></i>
            <p>暂无数据</p>
          </template>
          <el-table-column width="130">
            <template slot-scope="scope">
              <div class="cover">
                <img
                  :src="scope.row.cover"
                  v-if="scope.row.cover"
                  style="vertical-align: middle;"
                  alt
                />
                <span
                  style="display: block;background-color: #F2F3F8;width: 100%;height:60px;color: #DCDFE6;text-align: center;line-height: 60px;"
                  v-if="!scope.row.cover"
                >{{webTitle}}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column>
            <template slot-scope="scope">
              <p
                style="display: inline-block;vertical-align: middle;text-align: justify;"
              >[ {{ArticleType[scope.row.type]}} ] {{scope.row.title}}</p>
              <span style="color:#909399;display: block;font-size: 12px;">
                发布时间：
                <span style="color: #606266;">{{scope.row.create | toTimeStr}}</span>
              </span>
            </template>
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
      </el-card>

      <!-- <el-card class="box-card" v-loading="loading" shadow="never" v-if="false">
                        <router-link to="news_show" style="display: block;cursor: pointer" v-for="(o,k) in tableData" :key="k"
                                     class="text item announcement_list clearfix position: relative">
                            <el-row :gutter="15">
      <el-col :md="3" :sm="8" :xs="24">-->
      <!--<div style="width: 100px;height: 100px;max-height: 100px;background-color: #ddd"></div>-->
      <!-- <div class="cover">
                                        <img :src="o.url" v-if="o.url" style="vertical-align: middle;" alt="">
                                        <span style="display: block;background-color: #F2F3F8;width: 100%;height:60px;color: #DCDFE6;text-align: center;line-height: 60px;"
                                              v-if="!o.url">{{webTitle}}</span>
                                    </div>
                                </el-col>
                                <el-col :md="21" :sm="16" :xs="24" style="max-height: 100px;">
                                    <p style="color: #303133;display: inline-block;vertical-align: middle;text-align: justify;">
                                        {{o.title}}</p>
                                    <span style="color:#909399;display: block;font-size: 12px;">发布时间：<span
                                            style="color: #606266;">2018-10-13 17:39:45</span></span>
                                </el-col>
                            </el-row>
                        </router-link>
                        <div class="pagination" v-if="totalItems>1">
                            <el-pagination background @current-change="handleCurrentChange" :page-size="20"
                                           layout="prev, pager, next"
                                           :total="totalItems">
                            </el-pagination>
                        </div>
      </el-card>-->
      <!--</el-col>-->
      <!--</el-row>-->
    </section>
  </el-container>
</template>

<script>
import baseApi from "@/api/base";
import { mapState } from "vuex";

export default {
  name: "news",
  data() {
    return {
      resultList: [],
      totalItems: 0,
      currentPage: 1,
      loading: true,
      activeName2: "first",
      ArticleType: { 1: "新闻", 2: "公告", 3: "声明", 4: "上币" }
    };
  },
  computed: {
    ...mapState(["webTitle"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let p = this.currentPage;
      this.loading = true;
      try {
        let result = await baseApi.newsList(p);
        this.resultList = result.data;
        this.totalItems = result.count;
        this.loading = false;
      } catch (e) {}
    },
    handleOpen() {},
    showNews(row, column, event) {
      if (!row) return;
      // this.$refs.tickersTable.setCurrentRow(row);
      this.$router.push({
        path: `/newsShow/${row._id}`
      });
    },
    handleClose() {},
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    }
  }
};
</script>

<style scoped>
.cover img {
  height: 60px;
  width: 100%;
  /*max-height: 100px;*/
  /*max-width: 100px;*/
}

@media (max-width: 770px) {
  .cover {
    text-align: center;
    height: auto;
  }

  .cover img {
    height: auto;
    width: auto;
  }
}

.announcement_list {
  cursor: pointer;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.el-pagination {
  white-space: pre-line;
}
</style>
