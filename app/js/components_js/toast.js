/*
组件：toast
*/
Vue.component('toast-msg', {
  props: {
    msg: {
      type: String,
      default: ''
    },
  },
  template: "<span class='toast' v-if='msg'>{{msg}}</span>",
  data: function() {
    return {
      msg: ''
    }
  },
  watch: {
    msg: function(newValue, oldValue){
      if(newValue && newValue.length){
        this.show();
      }
    },
  },
  methods: {
    show: function(){
      var self = this;
      setTimeout(function() {
        self.msg = '';
        self.$emit('hide');
      }, 2000);
    }
  }
});
