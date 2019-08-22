<template>
  <main class="home-body">
    <ul>
      <li
        v-for="(item, index) in itemList"
        :key="index"
        :class="idx === index ? 'active-color' : ''"
        @click="tabList(index)">
        {{ $t(item.txt) }}
      </li>
    </ul>

    <!-- 收益 -->
    <public-list :itemList="earningsList" v-show="idx === 0"/>

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
        // {
        //   id: 1,
        //   txt: 'home.tabTxt2'
        // },
        {
          id: 2,
          txt: 'home.tabTxt3'
        }
      ],
      // resultsList: [
      //   {
      //     id: 1,
      //     tit: 'home.resultsTxt1',
      //     txt: '0'
      //   },
      //   {
      //     id: 2,
      //     tit: 'home.resultsTxt2',
      //     txt: '0 ETH'
      //   },
      //   {
      //     id: 3,
      //     tit: 'home.resultsTxt3',
      //     txt: '0 ETH'
      //   }
      // ],
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

      //walletAddress: '',
    }
  },
  computed: {
    earningsList () {
      return  [
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

    dataList () {
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
    imToken.callAPI('user.getCurrentAccount', function (err, address) {
      if (err) {
        imToken.callAPI('native.toastInfo', '获取钱包信息失败，请稍后重试')
      } else {
        this.getInfo (address)
      }
    })
  },
  methods: {
    tabList(index) {
      this.idx = index
    },
    getInfo (address) {
      let that = this
      console.log("获取当前钱包地址信息：" + address)
      // 获取信息
      this.$axios.get(_const.url+ "/aceWeb/operateBtt/getAccount?address="+ address).then(function (res) {
        let data = res.data.data
        let code = data.statusCode
        console.log(data);
        
        that.totalCount = data.v1Count + data.v2Count + data.v3Count
        that.v1Count = data.v1Count
        that.v2Count = data.v2Count
        that.v3Count = data.v3Count

        that.nodeLevel = data.area || '--' //节点级别

        that.todayEarning = (data.dayReceiveAmountEth + data.dayRechargeReceiveAmountEth + data.areaAmountEth + data.superSubAmountEth + data.superAllAmountEth) || 0 //当日收益 
        //day_receive_amount_eth + day_recharge_receive_amount_eth + areaAmountEth + superSubAmountEth + superAllAmountEth

        that.shareBonus = (data.areaAmountEth + data.superSubAmountEth + data.superAllAmountEth) || 0  //加权分红
        that.accuntEarning = data.receiveAmountEth //累计收益

        that.cashBalance = (data.receiveAmountEth - data.withdrawAmountEth) || 0 //可提现余额
        that.version = data.version || '--' //VIP级别
        that.dynamicEarning = data.dayReceiveAmountEth || 0 //动态收益
        that.staticEarning = data.dayRechargeReceiveAmountEth || 0//静态收益
  
      }).catch(function (error) {
        console.log("获取用户信息错误")
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
      padding: 0 .24rem;
      height: 1.28rem;
      box-sizing: border-box;
      @extend %flexCenter;
      color: #A2A8BF;
      font-size: .4rem;
      font-family: source-Medium;
      @include border($w: .04rem,$c: transparent,$d: bottom);
    }
    .active-color {
      border-color: #6D84F5;
      color: $blueColor;
    }
  }
}
</style>