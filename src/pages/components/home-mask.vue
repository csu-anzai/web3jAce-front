<template>
  <section class="mask">
    <section class="mask-content" v-show="maskPage === 0">
      <header>
        <span>{{ $t("mask.title") }}</span>
        <img src="../../assets/image/close.png" alt="" @click="closeMask">
      </header>

      <p>
        1 ETH = {{ bbtPrice }} BBT
      </p>

      <section class="ipt-list">
        <input type="number" v-model="moneyIpt" placeholder="1 ETH" />
        <section>
          <span>{{ allBbt }}</span>
          <span>BBT</span>
        </section>
      </section>

      <public-btn :txt = "maskBtn" @click.native="buyFrom"/>
    </section>

    <!-- tips提示框 -->
    <section class="mask-content tips-content" v-show="maskPage === 1">
      <p class="tips-text">{{ $t("home.transferTips") }}</p>
      <p class="tips-btn" @click="closeMask">我知道了</p>
    </section>
  </section>
</template>

<script>
import publicBtn from  "../../components/public-btn";
export default {
  name: 'homeMask',
  props: {
    maskPage: Number
  },
  components: {
    publicBtn
  },
  data() {
    return {
      maskBtn: 'mask.maskBtn',
      bbtPrice: 5000,
      moneyIpt: '',
      allBbt: 0
    }
  },
  methods: {
    closeMask () {
      this.moneyIpt = ''
      this.$emit('close')
    },

    buyFrom () {
      //alert("点击了购买按钮")
      
      this.closeMask()
    }
  },
  watch: {
    moneyIpt (newVla, oldVal) {
      this.allBbt = newVla * 5000
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/styless/public";
.mask {
  background: rgba(0, 0, 0, 0.2);
  @extend %flexCenter;
  @extend %fixed;
  .mask-content {
    width: 8.27rem;
    background:#fff;
    box-shadow: 0 .08rem .2rem rgba(0,0,0,0.3);
    border-radius: .21rem;
    @extend %flexCenter;
    flex-direction: column;
    padding-bottom: .48rem;
    header {
      @extend %flexBetween;
      @include border($d: bottom);
      width: calc(100% - .8rem);
      height: 1.07rem;
      color: $grayColor1;
      font-size: .37rem;
      padding: 0 .4rem;
      font-family: source-Regular;
      img {
        width: .32rem;
        height: .32rem;
      }
    }
    p {
      color: $blueColor;
      font-size: .43rem;
      padding: .69rem 0 .21rem;
      font-family: source-Bold;
    }
    .ipt-list {
      @extend %flexBetween;
      width: 7.47rem;
      padding: .27rem 0;
      margin-bottom: .56rem;
      @include border($d: bottom);
      font-size: .37rem;
      input {
        border: 0;
        flex: 1;
        color: $grayColor;
        max-width: 40%;
        font-family: lato-blod;
      }
      section {
        color: $grayColor1;
        max-width: 50%;
        white-space:nowrap;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: lato-Regular;
        span {
          width: .6rem;
          &:first-child {
            width: calc(100% - .6rem);
            overflow: hidden;
            white-space:nowrap;
            margin-right: .1rem;
          }
        }
      }
    }
    button {
      background:linear-gradient(90deg,#6d84f5 0%,#5e5aeb 100%);
      width: 7.47rem;
      color: #fff;
    }
    .tips-text {
      color: #525252;
      font-size: .38rem;
      padding: 0 .66rem;
      height: 3.09rem;
      @extend %flexCenter;
      border-bottom:1px solid rgba(230,230,230,1);
    }
    .tips-btn {
      color: #F5D281;
      font-size: .38rem;
      padding: 0;
      @extend %flexCenter;
      height: 1.17rem;
    }
  }
  .tips-content {
    padding: 0;
  }
}
</style>