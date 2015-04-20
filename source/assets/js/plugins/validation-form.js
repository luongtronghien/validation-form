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
    'required': 'Please input value'
  };

  var createAlertError = function(that, input, message){
    input.after('<div class="' + that.options.alertError + '">' + message + '</div>');
  };

  var removeAlertError = function(that, input){
    input.next('.' + that.options.alertError).remove();
  };

  var checkRequired = function(that, input) {
      var message = input.data('validation-required-message');

    if(!input.val() && !input.next('.' + that.options.alertError).length){
      if(message){
        createAlertError(that, input, message);
      }
      else{
        createAlertError(that, input, msg.required);
      }
    }
    else{
      removeAlertError(that, input);
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
        inputVL =  form.find('input,textarea,select').not("[type=submit]"),
        required = [];

      form.on('submit.' + pluginName, function(e){
        e.preventDefault();
        form.data('isValidated', true);
        $.each(inputVL, function(){
          var inputVl = $(this);
          if(inputVl.data('validation-required')){
            if(!checkRequired(that, inputVl)) {
              form.data('isValidated', false);
            }
          }
        });


        if(form.data('isValidated')) {
          return true;
        }
        return false;
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
