(function() {
  var HOST = /nonobank.com|mingxiaodai.com/.test(location.host) ? (location.protocol + '//' + location.host + (location.port ? ':' + location.port : '')) : "https://m.sit.nonobank.com";

  var am_id = getSearch()['am_id'] || '',
    approach = getSearch()['approach'] || '',
    approach2 = getSearch()['approach2'] || '',
    approach3 = getSearch()['approach3'] || '';
  var $http, uuid,
    timer = null,
    codeSentTime = 0,
    tokenId = localStorage.getItem('tongdun_token');

  var errortype = 0; //0: 无错 1、手机号错误 2、验证码错误 3、手机号已经注册
  var jwt = null;
  Vue.directive('focus', {
    inserted: function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    },
    componentUpdated: function(el, binding) {
      if (binding.modifiers.lazy) {
        if (Boolean(binding.value) === Boolean(binding.oldValue)) {
          return;
        }
      }
      if (binding.value) {
        el.focus();
      }
    },
  })

  var vm = new Vue({
    el: '#app',
    data: {
      user: {
        phone: '',
        codeImg: '',
        codeMsg: '',
        agreement: true
      },
      imgSrc: '',
      timeCount: -1,
      isLoading: false,
      focusStatus: 0, //1、图形验证码聚焦  2、短信验证码聚焦 3、手机号聚焦
      toastMsg: ''
    },
    watch: {
      'user.phone': function(val, oldval) {
        vm.focusStatus = 0;
        errortype = 0;
        if (val.length == 11) {
          vm.checkPhone();
          if (errortype == 0) {
            $http.get('/common/check/mobile/' + val).then(function(res) {
              if (res.succeed) {
                if (res.data.exists) {
                  vm.toastMsg = '手机号已注册，请直接登录';
                  errortype = 3;
                } else {
                  errortype = 0;
                  vm.focusStatus = 1;
                }
              } else {
                vm.toastMsg = res.errorMessage;
              }
            });
          }
        }
        if (codeSentTime >= 1) {
          codeSentTime = 0;
          vm.focusStatus = 0;
          vm.user.codeImg = '';
          vm.user.codeMsg = '';
          vm.timeCount = -1;
          setTimeout(function() {
            clearTimeout(timer);
            vm.refreshCaptcha();
          }, 0);
        }
      },
      'user.codeImg': function(val, oldval) {
        if (val.length == 4) {
          vm.checkPhone();
          if (errortype == 0) {
            var params = {
              uuid: uuid,
              captcha: val
            };
            $http.get('/common/captcha/verify', { params: params }).then(function(res) {
              if (res.succeed && res.data.valid) {
                vm.getCode();
              } else {
                vm.toastMsg = '请输入正确的验证码';
              }
            });
          } else {
            this.focusStatus = 3;
            this.user.codeImg = '';
            this.refreshCaptcha();
          }
        }
      }
    },
    methods: {
      init: function() {
        $http = new http();
        this.getTime(function() {
          vm.refreshCaptcha();
        });
      },
      getTime: function(callback) {
        $http.get('/common/current', { isTime: true }).then(function(res) {
          if (res && res.succeed) {
            vm.setTime(res.data.timestamp);
            callback && callback();
          }
        });
      },
      setTime: function(timeSys) {
        var offsetTime = timeSys - Date.now();
        setSession('landing-offsetTime', offsetTime);
      },
      refreshCaptcha: function() {
        $http.get('/common/captcha').then(function(res) {
          if (res && res.succeed) {
            var data = res.data;
            vm.imgSrc = data.captcha;
            uuid = data.uuid;
          }
        });
      },
      checkPhone: function() {
        var req = /1[345789]\d{9}$/;

        if (!this.user.phone.length) {
          this.toastMsg = '请输入手机号';
          errortype = 1;
          return;
        }
        if (!req.test(this.user.phone)) {
          this.toastMsg = '请输入正确的手机号';
          errortype = 1;
          return;
        }
        if (errortype == 3) {
          this.toastMsg = '手机号已注册，请直接登录';
        }
      },
      hide: function() {
        this.toastMsg = '';
      },
      countDown: function(t) { //倒计时
        this.focusStatus = 0;
        if (t >= 0) {
          vm.timeCount = t;
          t--;
          timer = setTimeout(function() {
            vm.countDown(t);
          }, 1000);
        }
      },
      getCode: function() {
        vm.focusStatus = 0;
        vm.timeCount = 60;
        var params = {
          // activity:true,
          mobile: vm.user.phone,
          captcha: vm.user.codeImg,
          uuid: uuid,
          codeType: 0,
          tokenId: tokenId
        }
        $http.post('/user/v-code', params).then(function(res) {
          if (res.succeed) {
            codeSentTime += 1;
            vm.timeCount = 60;
            vm.countDown(vm.timeCount);
            setTimeout(function() {
              vm.focusStatus = 2;
            }, 1000);
          } else {
            vm.toastMsg = res.errorMessage;
            codeSentTime = 0;
            vm.focusStatus = 1;
            vm.user.codeImg = '';
            vm.user.codeMsg = '';
            vm.timeCount = -1;
            setTimeout(function() {
              clearTimeout(timer);
              vm.refreshCaptcha();
            }, 0);
          }
        });
      },
      doRegister: function() {
        var params = {
          // activity:true,
          mobile: vm.user.phone,
          vcode: vm.user.codeMsg,
          tokenId: tokenId,
          uuid: uuid,
          captcha: vm.user.codeImg,
          amId: am_id,
          approach: approach,
          approach2: approach2,
          approach3: approach3
        }
        $http.post('/user/register', params, { loading: true }).then(function(res) {
          _czc.push(["_trackEvent", "注册页", "注册接口", "注册成功"]);
          if (res.succeed) {
            if (am_id == 2858) { //返利网渠道保存用户信息
              jwt = res.data.jwt;
              vm.setFanliInfo(function() {
                var type = getSearch()['type'] || '';
                if (type == 'gonewsite') {
                  vm.gotoWxsite();
                  return;
                }
                location.href = 'success.html';
              });
            } else {
              var type = getSearch()['type'] || '';
              if (type == 'gonewsite') {
                vm.gotoWxsite();
                return;
              }
              location.href = 'success.html';
            }

          } else if (res.errorCode == '0100154') {
            vm.toastMsg = '请输入正确的验证码';
          } else {
            vm.toastMsg = res.errorMessage;
          }
        });
      },

      register: function() {
        _czc.push(["_trackEvent", "注册页", "点击", "注册按钮"]);

        vm.checkPhone();

        if (errortype != 0) {
          return;
        }
        if (this.user.codeImg.length < 4 || this.user.codeMsg.length < 4) {
          vm.toastMsg = '请输入正确的验证码';
          return;
        }
        if (!this.user.agreement) {
          vm.toastMsg = '请阅读并勾选相关协议';
          return;
        }
        vm.doRegister();

      },
      gotoWxsite: function(type) {
        var self = this;
        if (type == 1) {
          _czc.push(["_trackEvent", "注册页", "点击", "直接登录"]);
          location.href = HOST + '/nono-app/#/home?am_id=' + am_id;
          return;
        }
        if (am_id == 2104) {
          var phoneVal = md5(self.user.phone);
          var img = new Image();
          img.height = 0;
          img.width = 0;
          img.src = 'https://conversion.pro.cn/arrive/enter?accountID=85d644269157dba60983&conversionID=8b5d4aee1fb4af8db0ab6157e0d93860&info=' + phoneVal;
          document.body.appendChild(img);
        }
        location.href = HOST + '/nono-app/#/home?showPop&am_id=' + am_id;
      },
      blur: function() {
        vm.focusStatus = 0;
      },
      goRegPrivacy: function() {
        location.href = 'regprivacy.html';
      },

      setFanliInfo: function(callback) {
        // 返利网渠道信息保存
        var params = {
          uid: getSearch()['uid'],
          targetUrl: getSearch()['target_url'],
          tc: getSearch()['tc'],
          trackingId: getSearch()['tracking_id'],
          actionTime: getSearch()['action_name'],
          code: getSearch()['code']
        };

        $http.post('/activity/nono-fali/user-info', params, { jwt: jwt }).then(function(res) {
          if (res.succeed) {
            console.log('保存成功');
            callback && callback();
          }
        });
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