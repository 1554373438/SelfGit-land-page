(function() {
  var vm = new Vue({
    el: '#app',
    data: {
      regContent:'',
      isLoading: false,
      toastMsg: ''
    },
    methods: {
      init: function() {
        $http = new http();
        var params = {
          bizCode: 0
        };
        $http.get('/common/agreement/privacy',{
          params: params,
          silence:true
        }).then(function(res) {
          if(res.succeed){
            vm.regContent = res.data && res.data.content;
          } else {
            vm.toastMsg = res.errorMessage;
          }
        });
      },
      hide: function() {
        vm.toastMsg = '';
      }
    }
  });

  vm.init();

  function handler(e) {
    vm.toastMsg = e.detail;
    vm.isLoading = false;
  }

  eventListener('loading', function() {
    vm.isLoading = true;
  });

  eventListener('loaded', function() {
    vm.isLoading = false;
  });

  eventListener('error', handler);

})();
