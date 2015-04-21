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

  var createAlertError = function(that, input, message){
    input.after('<div class="' + that.options.alertError + '">' + message + '</div>');
  };

  var removeAlertError = function(that, input){
    input.next('.' + that.options.alertError).remove();
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
    var reg = $.trim(input.val());
    if(reg){
      if(!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(reg)){
        return false;
      }
      else {
        return true;
      }
    }
    else{
      return true;
    }
  };

  var showErrorRequired = function(that, input, rule) {
    var message = input.data('validation-' + rule + '-message');

    if(!input.next('.' + that.options.alertError).length){
      if(message){
        createAlertError(that, input, message);
      }
      else {
        createAlertError(that, input, msg[rule]);
      }
    }
  };

  var showErrorEmail = function(that, input) {
    var message = input.data('validation-email-message');

    if(!input.next('.' + that.options.alertError).length){
      if(message){
        createAlertError(that, input, message);
      }
      else{
        createAlertError(that, input, msg.email);
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
        inputVL =  form.find('input,textarea,select').not("[type=submit]");

      form.data('isValidated', true);
      
      form.off('submit' ).on('submit', function(e){
        $.each(inputVL, function(){
          var self = $(this);

          if(self.data('validation-required')){
            self.off('change').on('change', function(){
              if(!requiredVL(self)){
                showErrorRequired(that, self, 'required');
                form.data('isValidated', false);
              } else{
                removeAlertError(that, self);
                form.data('isValidated', true);
                form.trigger('submit');
              }
            });

            if(!requiredVL(self)){
              showErrorRequired(that, self, 'required');
              form.data('isValidated', false);
            }
          }

          if(self.data('validation-email')){
            // self.off('change').on('change', function(){
            //   if(!emailVL(self)){
            //     showErrorEmail(that, self);
            //     form.data('isValidated', false);
            //   } else{
            //     removeAlertError(that, self);
            //     form.data('isValidated', true);
            //     form.trigger('submit');
            //   }
            // }
            // if(!emailVL(self)){
            //   showErrorEmail(that, self);
            //   form.data('isValidated', false);
            // }
          }
        });

        if(form.data('isValidated')){
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
