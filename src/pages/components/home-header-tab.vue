<template>
  <main class="home-header-tab">
    <h3>{{ $t("home.title") }}</h3>
    <p>{{ burningNumber }}BBT/ETH</p>

    <section class="ipt-list">
      <input type="number" placeholder="1 ETH" v-model="burningIpt" />
      <span>ETH</span>
    </section>

    <ul>
      <li
        v-for="(item, index) in itemList"
        :key="index"
        :class="idx === index ? 'active-bg' : ''"
        @click="tabEth(index, item.val)"
      >
        {{ item.txt }}
      </li>
    </ul>

    <public-btn :txt="sendBtn" @click.native="sendFrom" class="active-btn" />

    <public-btn :txt="exchangeBtn" />
    <!-- <public-btn :txt="exchangeBtn" @click.native="exchangeFrom" /> -->
  </main>
</template>

<script>
import publicBtn from "../../components/public-btn"

export default {
  name: 'homeHeaderTab',
  props: {},
  components: {
    publicBtn
  },
  data() {
    return {
      burningIpt: '1',
      burningNumber: 5000, //燃烧比列
      sendBtn: 'home.sendBtn',
      exchangeBtn: 'home.exchangeBtn',
      idx: 0,
      itemList: [
        {
          id: 1,
          val: '5',
          txt: '5 ETH'
        },
        {
          id: 2,
          val: '12',
          txt: '12 ETH'
        },
        {
          id: 3,
          val: '30',
          txt: '30 ETH'
        }
      ]
    }
  },
  methods: {
    tabEth(index, txt) {
      this.idx = index
      this.burningIpt = txt
    },

    sendFrom() {
      ///let ipt = this.burningIpt
      let a = !!window.imtoken
      console.log(a)

      // 使用 imToken 签名方法
      // var params = {
      //   from: window.accounts[0],
      //   to: '0xb32B93534bf338A446D619c60D0C95a176110798',
      //   value: '100000',
      //   orderInfo: 'signTransaction',
      // }

      // imToken.callAPI('transaction.signTransaction', params, function (err, hash) {
      //   if (err) {
      //     console.log("进入错误")
      //     console.log(err)
      //   } else {
      //     console.log("签名成功")
      //     console.log(hash)
      //   }
      // })

      // imToken.callAPI('user.getAccountList', function (err, list) {
      //   if (err) {
      //     console.log("进入错误2")
      //     console.log(err)
      //   } else {
      //     console.log("获取账户信息1：");
      //     console.log(list)
      //   }
      // })

      // imToken.callAPI('user.getCurrentAccount', function (err, address) {
      //   if (err) {
      //     console.log("进入错误3")
      //     console.log(err)
      //   } else {
      //     console.log("获取账户信息2：");
      //     console.log(address)
      //   }
      // })

    },

    exchangeFrom() {
      this.$emit('exchange')
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styless/public";
.home-header-tab {
  width: 8.67rem;
  margin: 0 auto 0.43rem;
  background: #fdfeff;
  text-align: center;
  padding: 0.85rem 0.4rem 0.64rem;
  box-shadow: 0 0.08rem 0.2rem rgba(17, 34, 117, 0.16);
  border-radius: 0.21rem;
  h3 {
    font-size: 0.32rem;
    color: $grayColor;
    padding-bottom: 0.27rem;
    font-family: source-Regular;
  }
  p {
    color: $blueColor;
    font-size: 0.48rem;
    font-family: lato-blod;
  }
  .ipt-list {
    @extend %flexBetween;
    margin: 1.33rem auto 0;
    height: 1.07rem;
    @include border($c: #6d84f5, $d: bottom);
    box-sizing: border-box;
    input {
      flex: 1;
      border: 0;
      color: $grayColor;
      font-size: 0.48rem;
      font-family: lato-blod;
    }
    span {
      width: 1rem;
      height: 1.07rem;
      color: #9598a6;
      font-size: 0.37rem;
      @extend %flexCenter;
      font-family: lato-Medium;
    }
  }
  ul {
    margin: 1.07rem auto;
    @extend %flexBetween;
    li {
      padding: 0.35rem 0.69rem;
      @include border($c: #d9d9d9, $d: bor, $s: dashed);
      border-radius: 0.05rem;
      font-size: 0.32rem;
      color: #a2a8bf;
      font-family: lato-blod;
    }
    .active-bg {
      background: #edf0fa;
      color: $blueColor;
      border-color: #edf0fa;
    }
  }
  button:last-child {
    margin-top: 0.27rem;
  }
  .active-btn {
    background: linear-gradient(90deg, #6d84f5 0%, #5e5aeb 100%);
    color: #fff;
  }
}
</style>