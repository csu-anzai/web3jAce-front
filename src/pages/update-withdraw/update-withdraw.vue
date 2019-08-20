<template>
  <main>
    <public-nav @returnPage="returnPage" :navRight="false" />

    <ul>
      <li>
        <p>{{ $t("withdraw.listTxt1") }}</p>
        <input
          type="text"
          v-model="gasPriceIpt"
          :placeholder="$t('withdraw.listTxt1')"
        />
      </li>
      <li>
        <p>{{ $t("withdraw.listTxt2") }}</p>
        <input
          type="text"
          v-model="gasLimitIpt"
          :placeholder="$t('withdraw.listTxt2')"
        />
      </li>
      <li>
        <p>{{ $t("withdraw.listTxt3") }}</p>
        <input
          type="text"
          v-model="tradingData"
          :placeholder="$t('withdraw.listTxt3')"
        />
      </li>
      <li>
        <p>Nonce</p>
        <input type="text" v-model="nonceIpt" placeholder="Nonce" />
      </li>
    </ul>

    <public-btn :txt="saveBtn" @click.native="savePage" />
  </main>
</template>

<script>
import publicNav from '../../components/public-nav'
import publicBtn from '../../components/public-btn'
export default {
  name: 'updateWithdraw',
  components: {
    publicNav,
    publicBtn
  },
  props: {},
  data() {
    return {
      gasPriceIpt: '',
      gasLimitIpt: '',
      tradingData: '0x',
      nonceIpt: '0',
      saveBtn: 'withdraw.saveBtn'
    }
  },
  computed: {

  },
  created() {
    
  },
  mounted() {
    
  },
  destroyed() { },
  methods: {
    returnPage() {
      this.$router.push({ path: '/withdraw' })
    },

    savePage() {
      this.$router.push({ path: '/withdraw' })
    }
  },
  beforeCreate () {
    
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styless/public";
main {
  ul {
    margin-top: 0.76rem;
    li {
      margin: 0 0.4rem;
      padding-top: 0.4rem;
      @include border($d: bottom);
      font-family: lato-Regular;
      p {
        color: #a2a8bf;
        font-size: 0.32rem;
        padding-bottom: 0.21rem;
      }
      input {
        width: 100%;
        height: 0.88rem;
        border: 0;
        color: $grayColor;
        font-size: 0.43rem;
        font-family: lato-Regular;
      }
      &:first-child {
        padding-top: 0;
      }
    }
  }

  button {
    width: 9.2rem;
    margin: 1.28rem 0.4rem 0;
    background: linear-gradient(90deg, #6d84f5 0%, rgba(94, 90, 235, 1) 100%);
    border: 0;
    color: #fff;
  }
}
</style>