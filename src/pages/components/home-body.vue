<template>
  <main class="home-body">
    <ul>
      <li
        v-for="(item, index) in itemList"
        :key="index"
        :class="idx === index ? 'active-color' : ''"
        @click="tabList(index)"
      >
        {{ $t(item.txt) }}
      </li>
    </ul>

    <!-- 收益 -->
    <public-list :itemList="earningsList" v-show="idx === 0" />

    <!-- 业绩 -->
    <!-- <public-list :itemList="resultsList" v-show="idx === 1" /> -->

    <!-- 数据 -->
    <public-list :itemList="dataList" v-show="idx === 1" />
  </main>
</template>

<script>
import publicList from "../../components/public-list"
import { log } from 'util';
export default {
  name: 'homeBody',
  components: {
    publicList
  },
  props: {

  },
  data() {
    return {
      idx: 0,
      itemList: [
        {
          id: 0,
          txt: 'home.tabTxt1'
        },
        {
          id: 2,
          txt: 'home.tabTxt3'
        }
      ],
      nodeLevel: '--',//玩家级别
      version: '--',//VIP级别
      todayEarning: 0,//当日收益
      shareBonus: 0,//加权分红
      accuntEarning: 0,//累计收益
      dynamicEarning: 0,//动态收益
      staticEarning: 0,//静态收益
      cashBalance: 0,//可提现余额

      totalCount: 0,
      v1Count: 0,
      v2Count: 0,
      v3Count: 0,
    }
  },
  computed: {
    earningsList() {
      return [
        {
          id: 1,
          tit: 'home.earningsTxt1',
          txt: this.nodeLevel
        },
        {
          id: 2,
          tit: 'home.earningsTxt2',
          txt: this.version
        },
        {
          id: 3,
          tit: 'home.earningsTxt3',
          txt: this.todayEarning + ' ETH'
        },
        {
          id: 4,
          tit: 'home.earningsTxt4',
          txt: this.shareBonus + ' ETH'
        },
        {
          id: 5,
          tit: 'home.earningsTxt5',
          txt: this.accuntEarning + ' ETH'
        },
        {
          id: 6,
          tit: 'home.earningsTxt6',
          txt: this.dynamicEarning + ' ETH'
        },
        {
          id: 7,
          tit: 'home.earningsTxt7',
          txt: this.staticEarning + ' ETH'
        },
        {
          id: 8,
          tit: 'home.earningsTxt8',
          txt: this.cashBalance + ' ETH'
        }
      ]
    },

    dataList() {
      return [
        {
          id: 1,
          tit: 'home.',
          txt: this.totalCount
        },
        {
          id: 2,
          tit: 'V1',
          txt: this.v1Count
        },
        {
          id: 3,
          tit: 'V2',
          txt: this.v2Count
        },
        {
          id: 4,
          tit: 'V3',
          txt: this.v3Count
        }
      ]
    }
  },
  mounted() {
    // this.getInfo()
  },
  methods: {
    tabList(index) {
      this.idx = index
    },
    getInfo() {
      let that = this
      imToken.callAPI('user.getCurrentAccount', function (err, address) {
        if (err) {
          imToken.callAPI('native.toastInfo', '获取钱包信息失败，请稍后重试')
        } else {
          // 获取信息
          let parm = {
            "address": address
          }
          this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify(parm)).then(res => {
            let data = res.data.data
            let code = data.statusCode
            if (data === "" || data === null || code === 400) {
              that.totalCount = 0
              that.v1Count = 0
              that.v2Count = 0
              that.v3Count = 0
              that.nodeLevel = '--' //节点级别
              that.todayEarning = 0 //当日收益 
              that.shareBonus = 0  //加权分红
              that.accuntEarning = 0//累计收益
              that.cashBalance = 0 //可提现余额
              that.version = '--' //VIP级别
              that.dynamicEarning = 0 //动态收益
              that.staticEarning = 0//静态收益
              imToken.callAPI('native.toastInfo', '用户不存在或者其他错误')
            } else {
              that.totalCount = Number(data.v1Count) + Number(data.v2Count) + Number(data.v3Count)
              that.v1Count = data.v1Count
              that.v2Count = data.v2Count
              that.v3Count = data.v3Count

              that.nodeLevel = data.area || '--' //节点级别

              that.todayEarning = (Number(data.dayReceiveAmountEth) + Number(data.dayRechargeReceiveAmountEth) + Number(data.areaAmountEth)
                + Number(data.superSubAmountEth) + Number(data.superAllAmountEth)) || 0 //当日收益 
              //day_receive_amount_eth + day_recharge_receive_amount_eth + areaAmountEth + superSubAmountEth + superAllAmountEth

              that.shareBonus = (Number(data.areaAmountEth) + Number(data.superSubAmountEth) + Number(data.superAllAmountEth)) || 0  //加权分红
              that.accuntEarning = data.receiveAmountEth || 0//累计收益

              that.cashBalance = (data.receiveAmountEth - data.withdrawAmountEth) || 0 //可提现余额
              that.version = data.version || '--' //VIP级别
              that.dynamicEarning = data.dayReceiveAmountEth || 0 //动态收益
              that.staticEarning = data.dayRechargeReceiveAmountEth || 0//静态收益
            }
          }).catch(error => {
            console.log("获取用户信息错误")
            console.log(error);
          });
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/styless/public";
.home-body {
  width: 9.47rem;
  background: #fff;
  margin: 0 auto;
  border-radius: 0.21rem 0.21rem 0 0;
  ul {
    @extend %flexBetween;
    margin: 0 auto;
    @include border($d: bottom);
    height: 1.28rem;
    box-sizing: border-box;
    padding: 0 1.07rem;
    li {
      padding: 0 0.24rem;
      height: 1.28rem;
      box-sizing: border-box;
      @extend %flexCenter;
      color: #a2a8bf;
      font-size: 0.4rem;
      font-family: source-Medium;
      @include border($w: 0.04rem, $c: transparent, $d: bottom);
    }
    .active-color {
      border-color: #6d84f5;
      color: $blueColor;
    }
  }
}
</style>