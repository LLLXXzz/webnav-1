// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('.lastLi');
var n = void 0;
// 利用数组哈希表的方式来保存  不然新增的页面无法保存 刷新就没了
//从本地存储提取
var x = localStorage.getItem('x');
//将字符串转成对象
var xObject = JSON.parse(x);
//第一次xObject如果是空的话 就存入默认的
var hasMap = xObject || [{ logo: 'B', logoType: 'image', url: 'https://www.bilibili.com' }, { logo: 'Z', logoType: 'image', url: 'https://www.zhihu.com' }, { logo: 'A', url: 'https://iqiyi.com' }, { logo: 'A', logoType: 'Text', url: 'https://www.acfun.cn' }];
//replace('searchValue','replaceValue') 替换为空字符串（目的是不显示）
var simplifyUrl = function simplifyUrl(url) {
    return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); //删除 /开头的所有内容
};
// 遍历哈希 每一项为node 并生成div添加到页面中（可以替代HTML） (添加在新增页面之前)
//封装到了render函数 渲染时就可以调用
var render = function render() {
    // 增加新的div后再次渲染hasMap 把之前的有的删除点 不然会出现两次
    // 找到已有的每一个li 除了最后一个
    $siteList.find('li:not(.lastLi)').remove();
    hasMap.forEach(function (node, index) {
        var $li = $('<li>\n        <div class="site">\n            <div class="siteLogo">' + node.logo[0] + '</div>\n            <div class="siteLink">' + simplifyUrl(node.url) + '</div>\n            <div class=\'siteClose\'>\n                <svg class="icon" aria-hidden="true">\n                    <use xlink:href="#icon-close"></use>\n                 </svg>\n            </div>\n        </div>\n </li>').insertBefore($lastLi);
        //点击打开新的页面 替代a标签
        $li.on('click', function () {
            window.open(node.url);
        });
        //删
        $li.on('click', '.siteClose', function (e) {
            e.stopPropagation(); // 阻止冒泡
            hasMap.splice(index, 1);
            render();
        });
    });
};

//一开始加载hasMap
render();

//使用jquery监听button
$('.addButton').on('click', function () {
    var url = window.prompt('请问你要添加地网址是啥？');
    //    判断用户输入地url是不是https开头，如果不是自动加上
    if (url.indexOf('https') !== 0) {
        url = 'https://' + url;
    }
    hasMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    });
    render();
    //新增后直接打开页面
    // window.open(url)  
});

//用户关闭页面之前 把哈希表存到Local Storage(本地存储)
window.onbeforeunload = function () {
    //Local Storage只能存字符串 对象转成字符串
    var string = JSON.stringify(hasMap);
    // localStorage是全局变量 可以省略window.localStorage
    // 保存 setItem(key,value) key随便写
    localStorage.setItem('x', string);
};
//键盘导航
// document.addEventListener.....也可以
$(document).on('keypress', function (e) {
    var key = e.key;
    for (var i = 0; i < hasMap.length; i++) {
        if (hasMap[i].logo.toLowerCase() === key) {
            window.open(hasMap[i].url);
        }
    }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.a75e3985.map