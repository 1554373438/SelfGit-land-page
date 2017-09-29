function setSession(name, value) {
  try {
    if(typeof value === 'object') {
      value = JSON.stringify(value);
    }
    window.sessionStorage.setItem(name, value);
  } catch (error) {
    Storage.prototype._setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function() {};
    alert('请不要在无痕模式下打开');
  }
}

function getSession(name) {
  var data = sessionStorage.getItem(name);
  try {
    return JSON.parse(data);
  } catch(e) {
    return data;
  }
}

function getSearch() {
  if (window.location.search == '') {
    return false;
  }
  var query_string = {},
    query = window.location.search.substring(1), //获取url中？之后的内容(字符串)
    vars = query.split("&"); //split()将字符串分割成字符串数组
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]); //URI解码
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }

  return query_string;
}

function isIphone() {
  var ua = navigator.userAgent.toLowerCase();
  return (ua.match(/iphone/i) == "iphone" || ua.match(/ipad/i) == "ipad");
}

function isAndroid() {
  var ua = navigator.userAgent.toLowerCase();
  return ua.match('android');
}

function openIos() {

  window.location = "NONOBANK://";
   
    var now = +new Date();
    var timer = setTimeout(function(){
        timer = setTimeout(function(){
          var newTime = +new Date();
          // if(now-newTime>1300){

          // }
           window.location = "https://itunes.apple.com/cn/app/nuo-nuo-bang-ke/id982437433?mt=8";


        }, 1200);
    }, 60);

  //摘自“淘宝”，打开APP后，自动移除下载跳转
  window.onblur = function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
}

function openAndroid() {
  var timer;
    // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
   

    var ifr = document.createElement("iframe");
    ifr.style.cssText = "display:none;width:0px;height:0px;";
    document.body.appendChild(ifr); 
    ifr.src = 'NONOBANK://';  //APP定义的打开协议

    //1秒内未打开APP，则跳转下载等。

    var t = Date.now();
    setTimeout(function(){
      if(Date.now()-t < 600){
        window.location = "https://m.nonobank.com/mxdsite/skipurl/?comefrom=BrandSpokesman&nexturl=http%3A%2F%2Fa.app.qq.com%2Fo%2Fsimple.jsp%3Fpkgname%3Dcom.nonoapp";
      }
    },500);

  //摘自“淘宝”，打开APP后，自动移除下载跳转
  window.onblur = function() {
    // alert('blur');
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (ifr) {
      document.body.removeChild(ifr);
    }
  }
}

//事件监听
function eventListener(type, handler){
  if(document.addEventListener){
    document.addEventListener(type, function(e){handler(e)}, false);
  } else {
    document.attachEvent('on' + type, function(e){handler(e)});
  }
}



