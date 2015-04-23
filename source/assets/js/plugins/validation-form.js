/**
 *  @name validationForm
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'validationForm';
  var isFalse = [];

  var insertError = function(that, input, message){
    input.after('<div class="' + that.options.alertError +'">' + message + '</div>');
  };

  var addMessageError = function(that, input, rule) {
    var message = input.data('validation-' + rule + '-message');

    if(!input.next('.' + that.options.alertError).length){
      if(message){
        insertError(that, input, message);
      }
      else {
        insertError(that, input, that.options.msg[rule]);
      }
    }
  };

  var removeMessageElement = function(that, input){
    var err = input.next('.' + that.options.alertError);
    if(err){
      err.remove();
    }
  };

  var removeMessageForm = function(that){
    var errClass = that.element.find('.' + that.options.alertError);
    if(errClass.length){
      errClass.remove();
    }
  };

  var requiredVL = function(input){
    if(!$.trim(input.val())){
      return false;
    }
    else {
      return true;
    }
  };

  var emailVL = function(input){
    var value = input.val();
    if(value){
      if(!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value)){
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  };

  var phoneVL = function(input){
    var value = input.val();
    if(value){
      if(!/^[0-9]{10,11}$/i.test(value)){
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  };

  var numberVL = function(input){
    var value = input.val();
    if(value){
      if(!/^[0-9]{10,11}$/i.test(value)){
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  };

  var validationElement = function(that, input) {
    var rules = that.options.rules;

    function validate(rule, input) {
      if (rules[rule] && !rules[rule](input)) {
        addMessageError(that, input, rule);
        isFalse.push('false');
        return;
      }
      removeMessageElement(that, input);
      return true;
    }

    for(var key in rules) {
      if (input.data('validation-' + key) && !validate(key, input)) {
        break;
      }
    }
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        form = that.element,
        inputVL =  form.find('input, textarea, select').not("[type=submit]");

      form.off('submit.validationForm').on('submit.validationForm', function(){
        isFalse = [];
        removeMessageForm(that);

        $.each(inputVL, function(){
          validationElement(that, $(this));
        });

        if(!isFalse.length) {
          return true;
        }
        else {
          return false;
        }
      });
    },
    publicMethod: function(params) {

    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    formGroup: 'form-group',
    alertError: 'alert-error',
    rules: {
      required: requiredVL,
      email: emailVL,
      phone: phoneVL,
      number: numberVL,
    },
    msg: {
      required: 'Please input value',
      email: 'Please input email',
      phone: 'Please input phone',
      number: 'Please input number',
    }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({
    });
  });

}(jQuery, window));
