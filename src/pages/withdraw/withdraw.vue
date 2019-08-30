
<template>
  <main>
    <header>
      <public-nav
        @returnPage="returnPage"
        @functionPage="setPage"
        :navRight="false"
      />
      <h2>{{ cashBalance }} ETH</h2>
      <ul>
        <li>
          <p>From</p>
          <p>{{ $t("withdraw.withdrawWallet") }} {{ walletAddress }}）</p>
        </li>
        <li>
          <p>DApps</p>
          <p>{{ walletLink.replace(/(.{30}).+(.{20})/, "$1...$2") }}</p>
        </li>
      </ul>
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
export default {
  name: 'withdraw',
  components: {
    publicBtn,
    publicNav
  },
  props: {},
  data() {
    return {
      balanceBtn: 'withdraw.balanceBtn',
      walletGas: 0.000021,
      walletAddress: '',
      walletLink: '',
      cashBalance: 0
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
    this.getGas()
  },
  destroyed() { },
  methods: {
    returnPage() {
      this.$router.push({ path: '/home' })
    },

    setPage() {
      this.$router.push({ path: '/updateWithdraw' })
    },

    getGas() {
      this.walletAddress = sessionStorage.getItem("address")
      this.walletLink = _const.urlLink + '/?address=' + this.walletAddress

      // 获取信息
      this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify({ "address": this.walletAddress })).then(res => {
        let data = res.data.data
        //console.log(data)
        if (data === "" || data === null) {
          this.walletGas = 0.000021
          this.cashBalance = 0
          imToken.callAPI('native.toastInfo', '用户不存在或者其他错误')
        } else {
          this.walletGas = data.gas || 0.000021
          this.cashBalance = this.cal.accSub((data.receiveAmountEth || 0), (data.withdrawAmountEth || 0))
        }
      }).catch(error => {
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        console.log(error);
      });
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
  background: #262626;;
  header {
    h2 {
      color: #fff;
      font-size: 0.48rem;
      padding-top: 0.76rem;
      text-align: center;
      font-family: lato-blod;
    }
    ul {
      margin-top: 1.03rem;
      li {
        padding: 0.37rem 0.4rem;
        @include border($d: bottom);
        p {
          color: #fff;
          font-size: 0.32rem;
          font-family: source-Regular;
          &:first-child {
            font-size: 0.37rem;
            color: #BFB6A0;
            padding-bottom: 0.27rem;
            font-family: lato-blod;
          }
        }
      }
    }
  }
  footer {
    flex: 1;
    @extend %flexBetween;
    flex-direction: column;
    padding: 0.37rem 0.4rem 0.48rem;
    section {
      @extend %flexBetween;
      width: 100%;
      font-size: 0.37rem;
      color: #fff;
      font-family: source-Regular;
      span:first-child {
        color: #BFB6A0;
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