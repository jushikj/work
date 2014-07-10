/**
 * jQuery download
 * @author menghr
 */
(function($) {
	var noop = function(){ return true; };
	var frameCount = 0;

	$.downloadDefault = {
		url: '',
		dataType: 'json',
		params: {},
		onSend: noop,
		onComplate: noop
	};

	$.download = function(options) {
		var opts = $.extend(jQuery.downloadDefault, options);
		if (opts.url == '') {
			return;
		}

		var canSend = opts.onSend();
		if (!canSend) {
			return;
		}

		var frameName = 'download_frame_' + (frameCount++);
		var iframe = $('<iframe style="position:absolute;top:-9999px" />').attr('name', frameName);

		//创建form
		var form = $('<form method="post" style="display:none;" enctype="multipart/form-data" />').attr('name', 'form_' + frameName);
		form.attr("target", frameName).attr('action', opts.url);
		//向form中放元素
		var formHtml = '';
		for (key in opts.params) {
			formHtml += '<input type="hidden" name="' + key + '" value="' + opts.params[key] + '">';
		}
		form.append(formHtml);

		iframe.appendTo("body");
		form.appendTo("body");

		form.submit();

		// iframe 在提交完成之后
		iframe.load(function() {
			var data = {};
			var jsonData = null;
			var frame = this;
			if(frame.contentWindow){
               data.responseText = frame.contentWindow.document.body ? frame.contentWindow.document.body.innerHTML : null;
               data.responseXML = frame.contentWindow.document.XMLDocument ? frame.contentWindow.document.XMLDocument : frame.contentWindow.document;
            }else{
                data.responseText = frame.contentDocument.document.body ? frame.contentDocument.document.body.innerHTML : null;
                data.responseXML = frame.contentDocument.document.XMLDocument ? frame.contentDocument.document.XMLDocument : frame.contentDocument.document;
            }
			var result = data.responseText;
			if (result!=null && result != '') {
				var s = result.indexOf('{');
				var e = result.indexOf('}');
				var jsonStr = result.substring(s,e+1);
				jsonData = eval('(' +jsonStr+ ')');
			}
			opts.onComplate(jsonData);
			setTimeout(function() {
				iframe.remove();
				form.remove();
			}, 5000);
		});

	};
})(jQuery);
