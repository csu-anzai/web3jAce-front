
<template>
  <main>
    <header>
      <public-nav @returnPage = 'returnPage' @functionPage = 'setPage' :navRight = "false"/>
      <withdraw-header />
    </header>

    <footer>
      <section>
        <span>gas</span>
        <span>{{ walletGas }}</span>
      </section>
      <!-- <public-btn :txt="balanceBtn" class="balance-btn" /> -->
    </footer>
  </main>
</template>

<script>
import publicBtn from '../../components/public-btn'
import publicNav from '../../components/public-nav'
import withdrawHeader from './components/withdraw-header'
export default {
  name: 'withdraw',
  components: {
    publicBtn,
    publicNav,
    withdrawHeader
  },
  props: {},
  data() {
    return {
      balanceBtn: 'withdraw.balanceBtn',
      walletGas: 0
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
    let that = this
    imToken.callAPI('user.getCurrentAccount', function (err, address) {
      if (err) {
        imToken.callAPI('native.toastInfo', '获取钱包信息失败，请稍后重试')
      } else {
        // 获取信息
        this.$axios.get(_const.url + "/aceWeb/operateBtt/getAccount?address=" + address).then(function (res) {
          let data = res.data.data
          let code = data.statusCode
          console.log(data);

          that.walletGas = data.gas
          

        }).catch(function (error) {
          console.log("获取用户信息错误")
          console.log(error);
        });
      }
    })
  },
  destroyed() { },
  methods: {
    returnPage () {
      this.$router.push({ path: '/' })
    },

    setPage () {
      this.$router.push({ path: '/updateWithdraw' })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styless/public";
main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background:#f5f6fa;
  header {
    background: #fff;
  }
  footer {
    flex: 1;
    @extend %flexBetween;
    flex-direction: column;
    padding: .37rem .4rem .48rem;
    section {
      @extend %flexBetween;
      width: 100%;
      font-size: .37rem;
      color: #6F7280;
      font-family: source-Regular;
      span:first-child {
        color: #1A1D33;
        font-family: lato-blod;
      }
    }
    .balance-btn {
      background: linear-gradient(
        90deg,
        rgba(109, 132, 245, 0.1) 0%,
        rgba(94, 90, 235, 0.1) 100%
      );
      color: #a2a8bf;
      border: 0;
    }
  }
}
</style>