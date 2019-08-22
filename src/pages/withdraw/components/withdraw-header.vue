<template>
  <header>
    <h2>5825 ETH</h2>
    <ul>
      <li>
        <p>From</p>
        <p>{{ $t('withdraw.withdrawWallet') }} {{ walletAddress }}）</p>
      </li>
      <li>
        <p>DApps</p>
        <p>{{ walletLink.replace(/(.{30}).+(.{20})/,'$1...$2') }}</p>
      </li>
    </ul>
  </header>
</template>

<script>
export default {
  name: 'withdrawHeader',
  props: {},
  data() {
    return {
      walletAddress: '',
      walletLink: ''
    }
  },
  mounted() {
    imToken.callAPI('user.getCurrentAccount', function (err, address) {
      if (err) {
        imToken.callAPI('native.toastInfo', '获取钱包信息失败，请稍后重试')
      } else {
        this.walletAddress = address
        this.walletLink = _const.urlLink + '/?address=' + address
      }
    })
  },
  methods: {

  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/styless/public";
h2 {
      color: #1A1D33;
      font-size: .48rem;
      padding-top: .76rem;
      text-align: center;
      font-family: lato-blod;
    }
    ul {
      margin-top: 1.03rem;
      li {
        padding: .37rem .4rem;
        @include border($d: bottom);
        p {
          color: #6F7280;
          font-size: .32rem;
          font-family: source-Regular;
          &:first-child {
            font-size: .37rem;
            color: $grayColor;
            padding-bottom: .27rem;
            font-family: lato-blod;
          }
        }
      }
    }
</style>