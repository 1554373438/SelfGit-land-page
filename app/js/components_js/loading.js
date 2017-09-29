/*
组件：loading
*/
Vue.component('loading', {
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  template: "<section class='popup row row-center' v-if='show'><span class='loading row row-center'><img src='images/loading.gif' width='26'></span></section>",
});
