/*
 * stringCalc v 2.0, 2014
 * Created by Valery Suntsov
 * email: vies@list.ru
 */

var stringCalc = function(parent) {
	this.stringCalcObj  = {
	
		create : function(){
			var _this = this;

			this.stringCalc = $("<div>").attr('id', 'stringCalc');
			this.addStr_btn = $("<button>")
				.addClass("add_string")
				.click(function (){
					_this.add_string();
				})
				.text('Добавить строчку');
			this.title = $("<h4>Сумма, р.</h4>");
			
			this.strings = $("<div>").addClass("strings");
			this.result_block = $("<div>")
				.addClass("result_block")
				.html("<div>Итого:</div>");
			this.result = $("<span>")
				.addClass ("result")
				.text(0);
			$(this.result_block).append(this.result);
			
			$(this.stringCalc)
				.html(this.addStr_btn)
				.append(this.title, this.strings, this.result_block);
			$(parent).append(this.stringCalc);
			this.bind_events();
		},

		add_string : function() {
			var string = $("<div>").addClass("string");		
			$(this.strings).prepend(string);
			this.edit_string(string);
			this.check_result_position();
		},
		
		edit_string : function(string, value) {
			var str = string;
			var _this = this,
				input = $("<input>"),
				save_button = $("<button>")	.text('Сохранить');
			if (value) {
				$(input).val(value.num_float());
				$(document).on('click', function() {
					if(value == $(input).val() || confirm("Вы действительно хотите отменить редактирование? Значение строки будет сброшено на предыдущее.")){
						_this.save(string, value.num_float().toString());
						$(this).off();
					}
				});
			} else {
				$(document).on('click', function() {
					if(!$(input).val() || confirm("Вы действительно хотите отменить редактирование? Введенное значение сохранено не будет.")){
						_this.remove_string(string);
						$(this).off();
					}
				});				
			}
			
			$(this.stringCalc).click(function(e){
				e.stopPropagation();
			});
			$(save_button).click(function() {
				_this.save(string, $(input).val().num_float());
			});
			
			$(string).html($("<div>").append(input))
				.append(save_button);
			this.check_result_position();
		},
		
		save : function (string, value) {
			if (!this.isNumber(value)){			
					alert('Введите число');
				return false;
			}
			if(parseFloat(value) > Number.MAX_SAFE_INTEGER){
				alert("Превышено максимальное значение числа");
				this.remove_string(string);
				return false;
			}
			$(document).off();
			var _this = this,
				strVal_block = $("<div>"),
				string_value = $("<span>"),
				remove_link = $("<a>");
				
			$(string_value).addClass("string_value")
				.text(value.toString().num_digits());
				
			$(strVal_block).html(string_value)
				.click(function() {
					_this.edit_string(string, $(string_value).text());
				});
			$(remove_link).addClass("remove_link")
				.text('Удалить')
				.click(function() {
					_this.remove_string(string);
				});				
			$(string).html(strVal_block).append(remove_link);
			
			this.adapt_string(strVal_block);		
			$(this.result).html(this.calculate());
			this.adapt_string(this.result_block);
			this.check_result_position();			
		},
		remove_string : function (string) {
			$(string).remove();		
			$(this.result).html(this.calculate());
			this.adapt_string(this.result_block);
			this.check_result_position();
		},		
		calculate : function() {
			var result = 0;
			$(".string_value", this.stringCalc).each(function() {
				var summand = $(this).text().num_float();
					result +=  summand;
			});
			
			return (result ? result.toString().num_digits() : 0);			
		},
		
		bind_events : function () {
			var _this = this;
			$( window ).bind('scroll resize', function() {
				_this.check_result_position();
			});	
		},
		
		isNumber : function (n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},

		
		check_result_position : function(){
			var block_width = $(this.result_block).width();
			if(!this.isScrolledIntoView(this.strings)){
				if (!$(this.result_block).hasClass("fixed"))					
					$(this.result_block).addClass("fixed").width(block_width);
			} else {
				if ($(this.result_block).hasClass("fixed"))
					$(this.result_block).removeClass("fixed").width('');
			}
		},
		
		isScrolledIntoView : function(elem) {
			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();

			var elemTop = $(elem).offset().top;
			var elemBottom = elemTop + $(elem).height() + $(elem).next().height();

			return (elemBottom <= docViewBottom);
		},
		adapt_string : function(text_parent){		
				var fontSize = 16,
					text = $('span:visible:first', text_parent),
					maxHeight = $(text_parent).height(),
					maxWidth = $(text_parent).width(),
					textHeight,
					textWidth;
					
				do {
					text.css('font-size', fontSize);
					textHeight = text.height();
					textWidth = text.width();
					fontSize = fontSize - 1;
				} while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 7);
		}
	}
	return this.stringCalcObj.create();	
};

String.prototype.num_digits = function() {
	return  this.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};
String.prototype.num_float = function() {
	var str = this.replace(/,(?=[^,]*$)/, ".");	
	str = str.replace(/\s+|[\,]/g, '');
	return parseFloat(str);
}
