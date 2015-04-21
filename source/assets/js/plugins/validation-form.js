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

  var getError = function(that, input, message){
    input.after('<div class="' + that.options.alertError + '">' + message + '</div>');
  };

  var addMessageError = function(that, form, input, rulesText, rules) {
    var message = input.data('validation-' + rulesText + '-message');

    if(!rules){
      if(!input.next('.' + that.options.alertError).length){
        if(message){
          getError(that, input, message);
        }
        else {
          getError(that, input, msg[rulesText]);
        }
      }
      form.data('isValidated', rules);
    }
  };

  var removeMessageError = function(that, form, input, rulestext, rules){
    if(rules){
      input.next('.' + that.options.alertError).remove();
      form.data('isValidated', rules);
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

  var validationEL = function(that, form, input, rulestext, rules){
    // input.off('change.input').on('change.input', function(){
    //   addMessageError(that, form, input, rulestext, rules);
    //   removeMessageError(that, form, input, rulestext, rules);
    //   form.trigger('submit.validationForm');
    // });
    removeMessageError(that, form, input, rulestext, rules);
    addMessageError(that, form, input, rulestext, rules);

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

      form.data('isValidated', true);

      form.off('submit.validationForm').on('submit.validationForm', function(){
        $.each(inputVL, function(){
          var self = $(this);

          if(self.data('validation-required')){
            validationEL(that, form, self, 'required', requiredVL(self));
          }

          if(self.data('validation-email')){
            validationEL(that, form, self, 'email', emailVL(self));            
          }

          if(self.data('validation-required') && self.data('validation-email')){

          }
        });

        if(form.data('isValidated')){
          return true;
        }
        return false;
      });

      form.off('change.el').on('change.el', inputVL, function(){
        // form.trigger('submit.validationForm');
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
