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
  var privateVar = null;

  var msg = {
    'required': 'Please input value',
    'email': 'Please input email'
  };

  var insertError = function(that, input, message){
    input.after('<div class="' + that.options.alertError + '">' + message + '</div>');
  };

  var addMessageError = function(that, input, rulesText) {
    var message = input.data('validation-' + rulesText + '-message');

    if(!input.next('.' + that.options.alertError).length){
      if(message){
        insertError(that, input, message);
      }
      else {
        insertError(that, input, msg[rulesText]);
      }
    }
  };

  var removeMessageError = function(that, input){
    var err = input.next('.' + that.options.alertError);
    if(err){
      err.remove();
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

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        form = that.element,
        inputVL =  form.find('input, textarea, select').not("[type=submit]"),
        validationFalse = [];

      form.off('submit.validationForm').on('submit.validationForm', function(){
        validationFalse = [];
        $.each(inputVL, function(){
          var input = $(this);
          var validationElement = function(validation, rules){
            if(input.data('validation-' + rules)){
              if(validation){
                removeMessageError(that, input);
              }
              else {
                addMessageError(that, input, rules);
                validationFalse.push('false');
              }
            }
          };

          validationElement(requiredVL(input), 'required');
          validationElement(emailVL(input), 'email');
          validationElement(phoneVL(input), 'phone');
        });
        if(!validationFalse.length){
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
    alertError: 'alert-error'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({
      'txtPassword': {
        'lenght': {
          valid: 6,
          mess: '> 6ky tu'
        },
        required: {
          valid: true,
          mess: 'this field is reuqid'
        }
      },
      'txt-username': {
        'required': {
          valid: true,
          mess: 'user  name is reuqied'
        }
      }
    });
  });

}(jQuery, window));
