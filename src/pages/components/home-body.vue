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
    currentInfo: Array
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
      inviteAmountEth: 0,//团队总数量
      rechargeAmountEth1: 0,//充值金额
      rechargeAmountEth2: 0,//总资产

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
        },
        {
          id: 9,
          tit: 'home.earningsTxt9',
          txt: this.inviteAmountEth
        },
        {
          id: 10,
          tit: 'home.earningsTxt10',
          txt: this.rechargeAmountEth1 + ' ETH'
        },
        {
          id: 11,
          tit: 'home.earningsTxt11',
          txt: this.rechargeAmountEth2 + ' ETH'
        }
      ]
    },

    dataList() {
      return [
        {
          id: 1,
          tit: 'home.homeTotal',
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
  created(){
    console.log("从父元素获取的数据开始")
    console.log(this.currentInfo);
    console.log("从父元素获取的数据结束")
  },
  mounted() {
    var that = this
    imToken.callAPI('user.getCurrentAccount', function (err, address) {
      if (err) {
        imToken.callAPI('native.toastInfo', '授权获取地址失败，请重新获取')
      } else {
        that.getInfoAll(address)
        return
      }
    })
   
  },
  methods: {
    tabList(index) {
      this.idx = index
    },
    getInfoAll(address) {
      console.log("获取父级地址:" + address);
      this.$axios.get(_const.url + "/aceWeb/operateBtt/getAccount?address=" + address).then(res => {
        let data = res.data.data
        console.log(data)
        console.log("body结束")
        if (data === "" || data === null) {
          this.totalCount = 0
          this.v1Count = 0
          this.v2Count = 0
          this.v3Count = 0
          this.nodeLevel = '--' //节点级别
          this.todayEarning = 0 //当日收益 
          this.shareBonus = 0  //加权分红
          this.accuntEarning = 0//累计收益
          this.cashBalance = 0 //可提现余额
          this.version = '--' //VIP级别
          this.dynamicEarning = 0 //动态收益
          this.staticEarning = 0//静态收益
          this.inviteAmountEth = 0
          this.rechargeAmountEth1 = 0
          this.rechargeAmountEth2 = 0
          imToken.callAPI('native.toastInfo', '用户不存在或者其他错误')
        } else {
          let count = this.cal.accAdd(data.v1Count, data.v2Count)
          this.totalCount = this.cal.accAdd(count, data.v3Count) || 0
          this.v1Count = data.v1Count || 0
          this.v2Count = data.v2Count || 0
          this.v3Count = data.v3Count || 0

          this.nodeLevel = data.area || '--' //节点级别
          this.version = data.version || '--' //VIP级别


          let dayReceive = this.cal.accAdd((data.dayReceiveAmountEth || 0), (data.dayRechargeReceiveAmountEth || 0))
          let superAll = this.cal.accAdd((data.superSubAmountEth || 0), (data.superAllAmountEth || 0))
          let total = this.cal.accAdd(dayReceive, superAll)

          this.todayEarning = this.cal.accAdd(total, Number(data.areaAmountEth || 0))//当日收益 
          //day_receive_amount_eth + day_recharge_receive_amount_eth + areaAmountEth + superSubAmountEth + superAllAmountEth

          let amount = this.cal.accAdd((data.areaAmountEth || 0), (data.superSubAmountEth || 0))
          this.shareBonus = this.cal.accAdd(amount, (data.superAllAmountEth || 0))  //加权分红

          this.cashBalance = this.cal.accSub((data.receiveAmountEth || 0), (data.withdrawAmountEth || 0)) //可提现余额

          this.accuntEarning = data.receiveAmountEth || 0//累计收益

          this.dynamicEarning = data.dayReceiveAmountEth || 0 //动态收益
          this.staticEarning = data.dayRechargeReceiveAmountEth || 0//静态收益
          this.inviteAmountEth = data.inviteAmountEth || 0 //团队总数量
          this.rechargeAmountEth1 = data.rechargeAmountEth || 0 //
          this.rechargeAmountEth2 = (data.rechargeAmountEth * 3) || 0
        }
      }).catch(error => {
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        console.log(error);
      });
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/styless/public";
.home-body {
  width: 9.47rem;
  background: #262626;
  margin: 0 auto;
  border-radius: 0.21rem 0.21rem 0 0;
  ul {
    @extend %flexBetween;
    margin: 0 auto;
    @include border($d: bottom, $c: rgba(255, 255, 255, 0.1));
    height: 1.28rem;
    box-sizing: border-box;
    padding: 0 1.07rem;
    li {
      padding: 0 0.24rem;
      height: 1.28rem;
      box-sizing: border-box;
      @extend %flexCenter;
      color: #999180;
      font-size: 0.4rem;
      font-family: source-Medium;
      @include border($w: 0.04rem, $c: transparent, $d: bottom);
    }
    .active-color {
      border-color: #e7c054;
      color: #e7c054;
    }
  }
}
</style>