/**
 *  @name validationForm
 *  @description description
 *  @version 1.0
 *  @options
 *    alertError: 'alert-error',
      groupInput: 'group-validation',
      loadAjax: true,
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
      },
      onBeforeSendAjax: function(form, options){},
      onSuccessSendAjax : function(form, options){}
 *  @events
 *    submit.validationForm
 *  @methods
 *    init
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'validationForm',
      isFalse = [],
      doc = $(document),
      regExp = {
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

  var clearField = function(form){
    form.find(':input').not(':submit').val('');
    form.find(':checkbox').prop('checked', false);
    form.find(':radio').prop('checked', false);
    form.find('select').find('option:first-child').prop('selected', true);
  };

  var ajaxFrom = function(that, form){
    $.ajax({
      url: form.attr('action'),
      cache: false,
      method: form.attr('method'),
      dataType: 'json',
      data: form.serialize(),
      beforeSend: function(){
        $('body').append('<img class="loading-ajax" src="images/ajax-loader.gif">');
        if($.isFunction(that.options.onBeforeSendAjax)){
          that.options.onBeforeSendAjax(form, that.options);
        }
      },
      complete: function(){
        $('.loading-ajax').remove();
      },
      error: function(){
        if(!$('.error-ajax').length){
          form.prepend('<div class="error-ajax">Load Ajax False!!!</div>');
        }
      },
      success: function(){
        clearField(form);
        if($.isFunction(that.options.onSuccessSendAjax)){
          that.options.onSuccessSendAjax(form, that.options);
        }
      }
    });
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

      form.off('submit.validationForm').on('submit.validationForm', function(e){
        isFalse = [];
        removeMessageForm(that);

        $.each(inputVL, function(){
          validationElement(that, $(this));
        });

        if(!isFalse.length) {
          if(that.options.loadAjax){
            e.preventDefault();
            ajaxFrom(that, form);
          }
        }
        else {
          e.preventDefault();
        }
      });
    },
    destroy: function() {
      var that = this,
          element = that.element;

      element.off('submit.validationForm');
      element.find('.' + that.options.alertError).remove();

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
    loadAjax: true,
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
    },
    onBeforeSendAjax: function(form, options){},
    onSuccessSendAjax : function(form, options){}
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({});
  });

}(jQuery, window));
