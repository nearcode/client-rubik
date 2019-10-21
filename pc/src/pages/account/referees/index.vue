<template>
  <div class="At_the_bottom">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>推荐关系</span>
      </div>

      <div class="text item">
        <el-tree :data="resultList" node-key="id" default-expand-all @node-click="handleNodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>第{{node.level}}级 ({{ node.label }})</span>
          </span>
        </el-tree>
      </div>
    </el-card>
  </div>
</template>
<script>
import baseApi from "@/api/base";

export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      resultList: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        let result = await baseApi.referrerTree();
        this.resultList = result.data;
      } catch (e) {}
    },
    handleNodeClick(data) {
      console.log(data);
    }
  }
};
</script>
<style lang="less" scoped>
</style>