(function ($) {
    $.fn.extend({
        //pass the options variable to the function
        gvmenu:function (options) {
			 var defaults = {},
            // Extend our default options with those provided.
            opts = $.extend(true, defaults, options),
			$this = $(this);
            $this.data('opts', opts);
			$this.find("li").unbind().bind('click', function () {
				   var n, self = $(this);
				   if (self.children("ul").size() == 0) {
					   if ($.isFunction(opts.handler)) {
                        var id = self.attr('id');
						var arg={
							 'load': self.attr('load'),
							'html': self.attr('html'),
							'text': self.attr('text'),
							'id': id
							};
                        opts.handler(arg);
                        var rootMenuId=self.parents('li[level="0"]').attr('id');
						$('#frame-mini-nav-menu').find('li').removeClass('active');
						$('#frame-mini-nav-menu').find('li[id="'+id+'"]').addClass('active');
						$('#frame-mini-nav-menu').find('li[id="'+rootMenuId+'"]').addClass('active');
						$('#frame-nav-body').find('li').removeClass('active');
						$('#frame-nav-body').find('li[id="'+id+'"]').addClass('active');
						$('#frame-nav-body').find('li[id="'+rootMenuId+'"]').addClass('active');
                        }
					}
				  }).bind('mouseenter',function(){
                         var self=$(this);
                         var selfH=self.height();
                         var subMenu=self.delay(100).children('ul');
                         var subMenuH=subMenu.height();
                         subMenu.stop().fadeIn(300);
                         self.siblings().children('ul').hide();
                         var offset=self.offset();
                         if(offset.top+subMenuH>$(window).height()-30){
                        	 subMenu.css({
                        		 top:-subMenuH+selfH/2+5
                        	 }).children('div.arrow').css({
                        		 top:subMenuH-12
                        	 })
                         }else{
                        	 subMenu.css({
                        		 top:selfH/2-15
                        	 }).children('div.arrow').css({
                        		 top:6
                        	 })
                         }

				  }).bind('mouseleave',function(){
					     var self=$(this);
					     self.stop().children('ul').hide();
				  })
        }
        });
    })(jQuery);
Gv.panel.AccordionPanel = function (opt) {
    this.level = 0;
    this.accordion = '';
    this.setting = {
        url: '',
        //动态记载ActioUrl
        data: null,
        //静态数据Array（优先级高）
        id: '',
        renderTo: '',
		miniRenderTo: '',
        handler: null,
        params: {},
        type: 'post',
        dataType: 'json',
        listeners: {
            afterLoad: null,
            beforeLoad: null
        },
        isAutoLoad: false
    };
    this.defaults = {
        accordion: true,
        speed: 200,
        closedSign: '<em></em>',
        openedSign: '<i></i>'
    };
    $.extend(true, this.setting, this.defaults, opt);
    this.init();


};
Gv.panel.AccordionPanel.prototype.init = function () {
    if (!Gv.dom(this.setting.renderTo)) {
        return null;
    }
    if (Gv.isEmpty(this.setting.data)) {
        this.load();
    } else {
        this.data();
    }
    //this.accordion = Gv.get(this.setting.renderTo).accordion(this.setting);
	 this.accordion = Gv.get(this.setting.renderTo).gvmenu(this.setting);

};
Gv.panel.AccordionPanel.prototype.data = function () {
    this.display(this.setting.data);
};
Gv.panel.AccordionPanel.prototype.load = function (cfg) {
    $.extend(true, this.setting, cfg);
    var self = this;
    Gv.ajax({
        url: this.setting.url,
        type: this.settings.type,
        dataType: this.settings.dataType,
        params: this.setting.params,
        successFun: function (r) {
            self.display(r)
            if ($.isFunction(self.setting.afterLoad)) {
                self.setting.afterLoad(r);
            }


        }
    });
};
Gv.panel.AccordionPanel.prototype.display = function (data) {
    Gv.get(this.setting.renderTo).html('');
    var nav = Gv.get(this.setting.renderTo);
   // var mini = Gv.get(this.setting.miniRenderTo);
    for (var i = 0; i < data.length; i++) {
        var d = data[i],t, h, f, z;
        t = d.text;

        f = d.url ? d.url : 'javascript:void(0);';
        z = d.load ? '' : 'z-icon';
       // h = '<li id="' + d.id + '" class="' + c + '" level="' + this.level + '"><a href="' + f + '" title="' + t + '" class="' + z + '"><tt class="' + d.icon + '"></tt><dd>' + t + '</dd></a></li>';

		  h = $('<li id="' + d.id + '"  level="' + this.level + '" />').attr({
            'load': d.load?d.load:'javascript:void(0);',
            'html': d.html,
            'text': t,
            'id': d.id
        }).append('<a href="' + f + '" title="' + t + '" class="' + z + '"><tt class="' + d.icon + '"></tt><dd>' + t + '</dd></a>');
		nav.append(h);
		// $('#' + d.id).data('item', {
//            load': d.load,
//            html': d.html,
//            text': d.text,
//            id': d.id
//        });

        if (!Gv.isEmpty(d.children)) {
            this.appendChild(d.id, d.children, this.level);
        }
    }

	this.makeMiniMenu();
};

Gv.panel.AccordionPanel.prototype.appendChild = function (id, data, level) {
    ++level;
	Gv.get(id).attr('attr','children').append('<ul id="' + id + '-subUl"></ul>');
    var arrow=$('<div  class="arrow" />');
    for (var x = 0; x < data.length; x++) {
        var sd = data[x],sh, sf;
        sf = sd.url ? sd.url : 'javascript:void(0);';

        sh = $('<li id="' + sd.id + '" level="' + level + '" />').attr({
            'load': sd.load,
            'html': sd.html,
            'text': sd.text,
            'id': sd.id
        }).append('<a href="' + sf + '"><tt class="' + sd.icon + '"></tt><dd class="text_content_ellipsis">' + sd.text + '</dd><i class="icon-play"></i></a>');
		Gv.get(id + '-subUl').append(sh).append(arrow);


	//		 nav.find('li[id="'+sd.id+'"]').data('item', {
//			            'load': sd.load,
//            'html': sd.html,
//            'text': sd.text,
//            'id': sd.id
//        });
//		 mini.find('li[id="'+sd.id+'"]').data('item', {
//			             'load':sd.load,
//            'html': sd.html,
//            'text': sd.text,
//            'id':sd.id
  //      });
        if (!Gv.isEmpty(sd.children)) {
            this.appendChild(sd.id, sd.children, level);
        }
    }
};

Gv.panel.AccordionPanel.prototype.makeMiniMenu = function () {

   var miniMenu=Gv.get(this.setting.renderTo).clone();
   miniMenu.attr({
   'class':'frame-mini-nav-menu',
   id:'frame-mini-nav-menu'}).css({height:'auto'}).find('li').removeClass('active');

   Gv.get('frame-mini-nav span[attr="mini"]').append(miniMenu);
   var miniopt={
	   renderTo:'frame-mini-nav span[attr="mini"]>ul',
	   handler:this.setting.handler
	   }
   miniMenu.gvmenu(miniopt);
};