<template>
  <section class="home-header-content">
    <header>
      <h2>{{ $t("home.bannerTit1") }}</h2>
      <h2>{{ $t("home.bannerTit2") }}</h2>
    </header>
  </section>
</template>

<script>
export default {
  name: "homeHeader",
  props: {},
  components: {
    
  },
  data() {
    return {
     
    };
  },
  mounted() {

  },
  methods: {
    
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styless/public";
.home-header-content {
  
  header {
    //@include bgCover("../../assets/image/headerBg.png");
    height: 7.49rem;
    font-family: lato-blod;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 2;
  h2 {
      color: #fff;
      font-size: 0.65rem;
      text-align: center;
      &:first-child {
        padding-top: 2.41rem;
      }
    }
    section {
      @extend %flexCenter;
      span {
        width: 1.17rem;
        height: 1.17rem;
        background: #fff;
        border-radius: 0.21rem;
        color: $grayColor;
        font-size: 0.72rem;
        @extend %flexCenter;
        margin-left: 0.13rem;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
</style>