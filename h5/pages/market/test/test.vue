<template>
  <div>
  123
  </div>
</template>
<script>
export default {
  name: "announcement",
  components: { },
  data() {
    return {
      isShow: true,
      refreshing: false,
      loadinging: false,
      lists: [1, 2, 3, 4, 5]
    };
  },
  methods: {
    onrefresh(event) {
      this.refreshing = true;
      setTimeout(() => {
        this.lists = [1, 2, 3, 4, 5];
        this.refreshing = false;
      }, 2000);
    },
    onloading(event) {
  
      this.loadinging = true;
      setTimeout(() => {
        this.loadinging = false;
        const length = this.lists.length;
        for (let i = length; i < length + 10; i++) {
          this.lists.push(i + 1);
        }
      }, 2000);
    }
  }
};
</script>
<style scoped>
.main-list {
  position: fixed;
  top: 88px;
  bottom: 1px;
  left: 0;
  right: 0;
}
.loading {
  flex-direction: row;
  margin-top: 20px;
  margin-bottom: 20px;
}
.indicator-text {
  color: #52a3d8;
  font-size: 24px;
  text-align: center;
}

.panel {
  width:200upx;
  height: 250upx;
  margin-left: 75px;
  margin-top: 35px;
  margin-bottom: 35px;
  flex-direction: column;
  justify-content: center;
  border-width: 2px;
  border-style: solid;
  border-color: #dddddd;
  background-color: #ffffff;
}
.text {
  font-size: 50px;
  text-align: center;
  color: #41b883;
}
</style>