<template>
  <div class="account_menu" style="overflow: hidden">
    <div class="head">
      <div class="user_base_info">
        <div class="user">
          <div class="user_head">
            <span style="color: #909399;font-size:4em;" class="icon-user"></span>
          </div>
          <!--<img src="@/assets/logo.png" width="20px" title="已通过实名认证" alt="">-->
        </div>
        <h5>
          <span class="username">{{username | noData}}</span>
          <span style="vertical-align: middle;"></span>
        </h5>
        <div class="tier-icon" :class="vipclass">
          <span>VIP-{{vip}}</span>
        </div>
        <p class="user_id ng-binding">ID {{uid |noData}}</p>
      </div>
    </div>
    <!--侧边栏-->
    <el-menu
      :default-active="onRoutes"
      background-color
      active-text-color="#fff"
      class="el-menu-vertical-demo"
      unique-opened
      @open="handleOpen"
      @close="handleClose"
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" v-if="item.isShow" :key="item.index">
            <template slot="title">
              <i :class="'fa fa-fw '+item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>

            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>

        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-if="item.isShow">
            <i :class="'fa fa-fw '+item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import c2cApi from "@/api/c2c";
import config from "@/config";
import _ from "lodash";

export default {
  name: "exchange",
  data() {
    return {
      items: [
        {
          icon: "icon-database",
          index: "/account/money",
          title: "我的资金",
          isShow: true
        },
        {
          icon: "icon-line-chart",
          index: "orders",
          title: "我的交易",
          isShow: true,
          subs: [
            {
              icon: "fa-database",
              index: "/account/orders",
              title: "我的委单"
            },
            {
              icon: "fa-database",
              index: "/account/myOrderHistory",
              title: "成交记录"
            }
          ]
        },
        {
          icon: "icon-lock",
          index: "lock",
          title: "锁仓管理",
          isShow: true,
          subs: [
            {
              icon: "fa-database",
              index: "/account/lock",
              title: "锁仓记录"
            },
            {
              icon: "fa-database",
              index: "/account/release",
              title: "释放记录"
            }
          ]
        },
        {
          icon: "icon-area-chart",
          index: "/account/finance",
          title: "财务记录",
          isShow: true
        },
        // {
        //     icon: 'fa-object-ungroup',
        //     index: '12',
        //     title: '项目管理'
        // },
        // {
        //     icon: 'fa-users',
        //     index: '/account/C2C',
        //     title: 'C2C管理',
        //     isShow: -1
        // },
        {
          icon: "icon-credit-card",
          index: "/account/bank",
          title: "支付绑定",
          isShow: true
        },
        {
          icon: "icon-address-card",
          index: "/account/cdd",
          title: "实名认证",
          isShow: true
        },
        {
          icon: "icon-shield",
          index: "/account/security",
          title: "安全中心",
          isShow: true
        },
        {
          icon: "icon-external-link",
          index: "/account/recommended",
          title: "推荐计划",
          isShow: true
        },
        // {
        //   icon: "fa-users",
        //   index: "/account/referees",
        //   title: "推荐关系",
        //   isShow: !config.isRenBi
        // },
        {
          icon: "icon-comments",
          index: "/account/tickets",
          title: "工单管理",
          isShow: true
        }
      ],
      info: {}
    };
  },
  computed: {
    ...mapState(["uid", "username", "authLevel", "c2cInfo", "vip"]),
    onRoutes() {
      // console.log(this.$route.path.replace('', '/account'))
      return this.$route.path.replace("", "");
    },
    vipclass() {
      if (this.vip == 0) {
        return "tier-icon0";
      } else if (this.vip > 0) {
        return "tier-icon1";
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      // this.$store.commit("getC2C", result => {
      //   this.info = result;
      //   if (this.info && this.info["merchant"]) {
      //     // let item = _.findBy(this.items, {icon: 'fa-users'});
      //     for (var item of this.items) {
      //       if (item.icon == "fa-users") {
      //         item.isShow = 1;
      //         console.log(item);
      //       }
      //     }
      //   }
      // });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped>
/*vip*/
.tier-icon {
  font: 1em/1 Open Sans, Impact !important;
  text-align: center;
}
.tier-icon0 {
  color: #ccc;
  background: #ccc;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-size: 14px;
  font-family: Impact;
  border-radius: 3px;
}
.tier-icon1 {
  color: #000;
  margin-right: 0;
  font-size: 14px;
  font-family: Impact;
  border-radius: 3px;
  background: #fceabb;
  background: -moz-linear-gradient(
    top,
    #fceabb 0,
    #fccd4d 50%,
    #f8b500 51%,
    #fbdf93 100%
  );
  background: -webkit-linear-gradient(
    top,
    #fceabb 0,
    #fccd4d 50%,
    #f8b500 51%,
    #fbdf93 100%
  );
  background: linear-gradient(
    to bottom,
    #fceabb 0,
    #fccd4d 50%,
    #f8b500 51%,
    #fbdf93 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fceabb', endColorstr='#fbdf93', GradientType=0 );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.el-menu-vertical-demo .el-menu-item.is-active {
  background-color: #409eff !important;
}

.head {
  border-right: solid 1px #e6e6e6;
  border-bottom: solid 1px #e6e6e6;
  background-color: white;
  padding: 20px 0 10px;
}

.user {
  position: relative;
  width: 40px;
  height: 40px;
  margin: auto;
}

.user_head {
  margin: 0 auto;
  width: 40px;
  height: 40px;
  overflow: hidden;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  border: 2px solid #31b0d5;
}

.user_base_info > h5 {
  width: 100%;
  height: 14px;
  font-weight: 700;
  margin: 10px auto;
  text-align: center;
}

.user_base_info > h5 > span.username {
  width: 130px;
  width: 9.28rem;
  margin: 0 auto;
  color: #31b0d5;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.user_base_info > p {
  text-align: center;
  padding: 5px;
}
</style>