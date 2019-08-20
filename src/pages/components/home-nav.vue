<template>
  <nav v-show="navShow">
    <!-- 导航栏 -->
    <ul class="nav">
      <li>
        <img src="../../assets/image/navLogo.png" alt="" class="logo"/>
        <img src="../../assets/image/navTxt.png" alt="" class="logo-txt"/>
      </li>
      <li @click="tabNav">
        <img src="../../assets/image/navTab.png" alt="" class="logo"/>
      </li>
    </ul>

    <!-- 语言选择 -->
    <ul v-show="tabShow">
      <li 
        v-for="(item, index) in itemList"
        :class="idx === index ? 'active-nav' : ''"
        :key="index"
        @click="tabLanguage(index)">
        {{ item.txt }}
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'homeNav',
  data() {
    return {
      idx: 0,
      tabShow: false,
      navShow: true,
      itemList: [
        {
          id: 1,
          txt: 'English'
        },
        {
          id: 1,
          txt: '中文'
        }
      ]
    }
  },
  methods: {
    //切换显示隐藏
    tabNav() {
      this.tabShow = !this.tabShow
    },

    //切换语言
    tabLanguage (index) {
      if (index === 0) {
        this.$i18n.locale = 'en'
        this.idx = 0
      } else {
        this.$i18n.locale = 'zh'
        this.idx = 1
      }
      this.tabShow = false
    },

    handleScroll () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 88) {
        this.navShow = false
      } else {
        this.navShow = true
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/styless/public";
nav {
  .nav {
    height: 1.17rem;
    @extend %flexBetween;
    padding: 0 .64rem 0 .67rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: rgba(0,0,0,.1);
    width: 8.72rem;
    margin: 0 auto;
    li {
      .logo {
        width: .64rem;
        height: .64rem;
      }
      .logo-txt {
        width: 1.96rem;
        height: .32rem;
        margin-left: .16rem;
      }
      &:first-child {
        @extend %flexCenter;
      }
    }
  }
  & ul:last-child {
    position: fixed;
    top: 1.17rem;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 99;
    color: #000;
    width: 10rem;
    margin: 0 auto;
    li {
      @extend %flexCenter;
      height: 1.17rem;
      color: #A2A8BF;
      font-size: .37rem;
      font-family: source-Regular;
    }
    & .active-nav {
      color: $blueColor;
      background:#edf0fa;
    }
  }
}
</style>
