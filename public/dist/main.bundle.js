/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/js/main.js":
/*!***************************!*\
  !*** ./public/js/main.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function ($) {\n  \"use strict\";\n  /*[ Load page ]\r\n  ===========================================================*/\n\n  $(\".animsition\").animsition({\n    inClass: 'fade-in',\n    outClass: 'fade-out',\n    inDuration: 1500,\n    outDuration: 800,\n    linkElement: '.animsition-link',\n    loading: true,\n    loadingParentElement: 'html',\n    loadingClass: 'animsition-loading-1',\n    loadingInner: '<div data-loader=\"ball-scale\"></div>',\n    timeout: false,\n    timeoutCountdown: 5000,\n    onLoadEvent: true,\n    browser: ['animation-duration', '-webkit-animation-duration'],\n    overlay: false,\n    overlayClass: 'animsition-overlay-slide',\n    overlayParentElement: 'html',\n    transition: function transition(url) {\n      window.location.href = url;\n    }\n  });\n  /*[ Back to top ]\r\n  ===========================================================*/\n\n  var windowH = $(window).height() / 2;\n  $(window).on('scroll', function () {\n    if ($(this).scrollTop() > windowH) {\n      $(\"#myBtn\").css('display', 'flex');\n    } else {\n      $(\"#myBtn\").css('display', 'none');\n    }\n  });\n  $('#myBtn').on(\"click\", function () {\n    $('html, body').animate({\n      scrollTop: 0\n    }, 300);\n  });\n  /*[ Show header dropdown ]\r\n  ===========================================================*/\n\n  $('.js-show-header-dropdown').on('click', function () {\n    $(this).parent().find('.header-dropdown');\n  });\n  var menu = $('.js-show-header-dropdown');\n  var sub_menu_is_showed = -1;\n\n  for (var i = 0; i < menu.length; i++) {\n    $(menu[i]).on('click', function () {\n      if (jQuery.inArray(this, menu) == sub_menu_is_showed) {\n        $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');\n        sub_menu_is_showed = -1;\n      } else {\n        for (var i = 0; i < menu.length; i++) {\n          $(menu[i]).parent().find('.header-dropdown').removeClass(\"show-header-dropdown\");\n        }\n\n        $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');\n        sub_menu_is_showed = jQuery.inArray(this, menu);\n      }\n    });\n  }\n\n  $(\".js-show-header-dropdown, .header-dropdown\").click(function (event) {\n    event.stopPropagation();\n  });\n  $(window).on(\"click\", function () {\n    for (var i = 0; i < menu.length; i++) {\n      $(menu[i]).parent().find('.header-dropdown').removeClass(\"show-header-dropdown\");\n    }\n\n    sub_menu_is_showed = -1;\n  });\n  /*[ Fixed Header ]\r\n  ===========================================================*/\n\n  var posWrapHeader = $('.topbar').height();\n  var header = $('.container-menu-header');\n  $(window).on('scroll', function () {\n    if ($(this).scrollTop() >= posWrapHeader) {\n      $('.header1').addClass('fixed-header');\n      $(header).css('top', -posWrapHeader);\n    } else {\n      var x = -$(this).scrollTop();\n      $(header).css('top', x);\n      $('.header1').removeClass('fixed-header');\n    }\n\n    if ($(this).scrollTop() >= 200 && $(window).width() > 992) {\n      $('.fixed-header2').addClass('show-fixed-header2');\n      $('.header2').css('visibility', 'hidden');\n      $('.header2').find('.header-dropdown').removeClass(\"show-header-dropdown\");\n    } else {\n      $('.fixed-header2').removeClass('show-fixed-header2');\n      $('.header2').css('visibility', 'visible');\n      $('.fixed-header2').find('.header-dropdown').removeClass(\"show-header-dropdown\");\n    }\n  });\n  /*[ Show menu mobile ]\r\n  ===========================================================*/\n\n  $('.btn-show-menu-mobile').on('click', function () {\n    $(this).toggleClass('is-active');\n    $('.wrap-side-menu').slideToggle();\n  });\n  var arrowMainMenu = $('.arrow-main-menu');\n\n  for (var i = 0; i < arrowMainMenu.length; i++) {\n    $(arrowMainMenu[i]).on('click', function () {\n      $(this).parent().find('.sub-menu').slideToggle();\n      $(this).toggleClass('turn-arrow');\n    });\n  }\n\n  $(window).resize(function () {\n    if ($(window).width() >= 992) {\n      debugger;\n\n      if ($('.wrap-side-menu').css('display') == 'block') {\n        $('.wrap-side-menu').css('display', 'none');\n        $('.btn-show-menu-mobile').toggleClass('is-active');\n      }\n\n      if ($('.sub-menu').css('display') == 'block') {\n        $('.sub-menu').css('display', 'none');\n        $('.arrow-main-menu').removeClass('turn-arrow');\n      }\n    }\n  });\n  /*[ remove top noti ]\r\n  ===========================================================*/\n\n  $('.btn-romove-top-noti').on('click', function () {\n    $(this).parent().remove();\n  });\n  /*[ Block2 button wishlist ]\r\n  ===========================================================*/\n\n  $('.block2-btn-addwishlist').on('click', function (e) {\n    e.preventDefault();\n    $(this).addClass('block2-btn-towishlist');\n    $(this).removeClass('block2-btn-addwishlist');\n    $(this).off('click');\n  });\n  /*[ +/- num product ]\r\n  ===========================================================*/\n\n  $('.btn-num-product-down').on('click', function (e) {\n    e.preventDefault();\n    var numProduct = Number($(this).next().val());\n    if (numProduct > 1) $(this).next().val(numProduct - 1);\n  });\n  $('.btn-num-product-up').on('click', function (e) {\n    e.preventDefault();\n    var numProduct = Number($(this).prev().val());\n    $(this).prev().val(numProduct + 1);\n  });\n  /*[ Show content Product detail ]\r\n  ===========================================================*/\n\n  $('.active-dropdown-content .js-toggle-dropdown-content').toggleClass('show-dropdown-content');\n  $('.active-dropdown-content .dropdown-content').slideToggle('fast');\n  $('.js-toggle-dropdown-content').on('click', function () {\n    $(this).toggleClass('show-dropdown-content');\n    $(this).parent().find('.dropdown-content').slideToggle('fast');\n  });\n  /*[ Play video 01]\r\n  ===========================================================*/\n\n  var srcOld = $('.video-mo-01').children('iframe').attr('src');\n  $('[data-target=\"#modal-video-01\"]').on('click', function () {\n    $('.video-mo-01').children('iframe')[0].src += \"&autoplay=1\";\n    setTimeout(function () {\n      $('.video-mo-01').css('opacity', '1');\n    }, 300);\n  });\n  $('[data-dismiss=\"modal\"]').on('click', function () {\n    $('.video-mo-01').children('iframe')[0].src = srcOld;\n    $('.video-mo-01').css('opacity', '0');\n  });\n})(jQuery);\n\n//# sourceURL=webpack:///./public/js/main.js?");

/***/ })

/******/ });