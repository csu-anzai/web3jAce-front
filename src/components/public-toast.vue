<template>
  <section class="mask">
    <section class="mask-cnt">
      {{ txt }}
    </section>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    txt: String
  },
  data () {
    return {

    }
  },
  methods: {

  },
}
</script>

<style scoped lang="scss">
@import "../assets/styless/public";
.mask {
  @extend %fixed;
  @extend %flexCenter;
  .mask-cnt {
    @extend %flexCenter;
    height: 1.25rem;
    background:rgba(0, 0, 0, .8);
    border-radius: .2rem;
    padding: 0 .65rem;
    color: #fff;
  }
}
</style>