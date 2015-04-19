var Site = (function($, window, undefined) {
  var privateVar = 1;
  var regTest = function(){
    var str = "!$%&";
    var patt = new RegExp("[a-zA-Z0-9.!#$%&]");
    var res = patt.test(str);
  }
  function privateMethod1() {
    $("input,select,textarea").not("[type=submit]").jqBootstrapValidation();
    // console.log($.each(function(){}));
    console.log($('ul').data('mgs-text'));
  }
  return {
    publicVar: 1,
    publicObj: {
      var1: 1,
      var2: 2
    },
    publicMethod1: privateMethod1,
    regTest: regTest
  };

})(jQuery, window);

jQuery(function() {
  Site.publicMethod1();
  Site.regTest();
});
