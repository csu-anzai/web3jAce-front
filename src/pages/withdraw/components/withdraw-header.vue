<template>
  <header>
    <h2>5825 ETH</h2>
    <p class="header-txt">≈US$0.00</p>
    <ul>
      <li>
        <p>From</p>
        <p>多币种钱包 1（0x5265d8cae6...d2eadae9c9b6）</p>
      </li>
      <li>
        <p>DApps</p>
        <p>http://miraclelab.github.io/?c...d2eadae9c9b5265d8cae6</p>
      </li>
      <li>
        <p>{{ $t("withdraw.internetFee") }}</p>
        <p>5825 ETH (USS$0.40)</p>
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

    }
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
    .header-txt {
      color: $grayColor1;
      font-size: .32rem;
      text-align: center;
      font-family: lato-Regular;
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
        &:last-child {
          @extend %flexBetween;
          p {
            padding: 0;
          }
        }
      }
    }
</style>