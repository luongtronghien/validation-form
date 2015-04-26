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
  var regExp = {
    EMAIL: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    PHONE: /^[0-9]{10,11}$/,
    NUMBER: /^[-+]?[0-9]+$/
  };

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
    if(input.attr('type') === 'checkbox'){
      return input.is(':checked');
    }else if(input.is('select')){
      return input.find('option:selected').index() !== 0;
    }

    return $.trim(input.val());
    // return (input.attr('type') === 'checkbox') ? input.is(':checked') : (input.is('select')) ? input.find('option:selected').length : $.trim(input.val());
  };

  var groupVL = function(group){
    var groupNeedCheck = group.data('validation-group'),
      arrID = groupNeedCheck.split(',');

    if(arrID.length < 2 && $('[name="' + arrID + '"]').is(':checked')){
      return true;
    }

    for(var i = 0; i < arrID.length; i++){
      if($(arrID[i]).is(':checked')){
        return true;
      }
    }

    return false;
  };

  var checkRegExp = function (regExp) {
    return function (input) {
      var value = input.val();
      return !value || regExp.test(value);
    };
  };

  var emailVL = checkRegExp(regExp.EMAIL);

  var phoneVL = checkRegExp(regExp.PHONE);

  var numberVL = checkRegExp(regExp.NUMBER);

  var minVL = function(input){
    var isNumber = checkRegExp(regExp.NUMBER),
        value = input.val();

    return !value || isNumber && (value >= Number(input.data('validation-min')));
  };

  var maxVL = function(input){
    var isNumber = checkRegExp(regExp.NUMBER),
        value = input.val();

    return !value || isNumber && (value <= Number(input.data('validation-max')));
  };

  var maxlengthVL = function(input){
    var value = input.val(),
        numberMax = Number(input.data('validation-maxlength'));
    return !value || $.trim(value).length <= numberMax;
  };

  var minlengthVL = function(input){
    var value = input.val(),
        numberMin = Number(input.data('validation-minlength'));
    return !value || $.trim(value).length >= numberMin;
  };

  var matchVL = function(input){
    return input.val() === $(input.data('validation-match')).val();
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
        inputVL =  form.find('input, textarea, select, [data-validation-group]').not("[type=submit]");

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
    alertError: 'alert-error',
    groupInput: 'group-validation',
    rules: {
      required: requiredVL,
      group: groupVL,
      email: emailVL,
      phone: phoneVL,
      number: numberVL,
      min: minVL,
      max: maxVL,
      maxlength: maxlengthVL,
      minlength: minlengthVL,
      match: matchVL
    },
    msg: {
      required: 'Please input value',
      group: 'Please checked input',
      email: 'Please input email',
      phone: 'Please input phone',
      number: 'Please input number',
      min: 'Min incorrect',
      max: 'Max incorrect',
      maxlength: 'Max length incorrect',
      minlength: 'Min length incorrect',
      match: 'Not match'
    }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({
    });
  });

}(jQuery, window));
