var global_pageintegration_header={

		email_old : null,
		phoneNum_old : null,
		descInfo_old : null,

		modifyUserInfo:function(){

			var canSendRequest = true;

//			var modifyUserInfoUserNameTF = new Gv.form.TextField({
//				id : 'modifyUserInfoUserNameTF-id',
//				fieldLabel : '用户名',
//				allowBlank : true,
//				disabled : true,
//				value : "aaa"
//			});

			//alert(global_pageintegration_header.LonginUserEmail);

			var modifyUserInfoEmailEF = new Gv.form.EmailField({
				id : 'modifyUserInfoEmailEF-id',
				fieldLabel : '<i class="gv-field-required-star">*</i>邮箱地址',
				allowBlank : false,
				//value : global_pageintegration_header.LonginUserEmail,
				blankText : '邮箱地址不能为空',
				emptyText : "请输入邮箱地址"
			});

			var modifyUserInfoPhoneNumTF = new Gv.form.TextField({
				id : 'modifyUserInfoPhoneNumTF-id',
				fieldLabel : '手机号',
				//value : global_pageintegration_header.LonginUserPhoneNum,
				allowBlank : true,
				emptyText : "请输入手机号"
			});

			var modifyUserInfoDescInfoTA = new Gv.form.TextArea({
				id : 'modifyUserInfoDescInfoTA-id',
				height : 50,
				fieldLabel : '描述信息',
				allowBlank : true,
				//value : global_pageintegration_header.LonginUserDescInfo,
				emptyText : "请输入描述信息",
				maxLength : 128
			});

			var modifyUserInfoForm = new Gv.form.FormPanel({
				id : 'modifyUserInfoForm-id',
				layout : 'form',// 单列形式form,双列形式column
				items : [ modifyUserInfoEmailEF,modifyUserInfoPhoneNumTF,modifyUserInfoDescInfoTA ]
			});

			var modifyUserInfoWin = new Gv.Window(
					{
						id : 'modifyUserInfoWin-id',
						title : '修改个人信息',
						width : 415,
						height : 140,
						bodyStyle : 'padding:10px;',
						items : [ modifyUserInfoForm ],
						listeners:{
							afterLayout : function() {

								//紧致输入密码
								$("#modifyUserInfoEmailEF-id").bind('keyup',function(){
									this.value = this.value.replace(/\s/g,'');
								});
								$("#modifyUserInfoPhoneNumTF-id").bind('keyup',function(){
									this.value = this.value.replace(/\s/g,'');
								});

							}
						},
						tbar : [
								{
									text : '确认',
									handler : function() {
										if(!canSendRequest){
											return;
										}

										var emailVal = modifyUserInfoEmailEF.value().trim();
										var phoneNumVal = modifyUserInfoPhoneNumTF.value().trim();
										var userDescVal = modifyUserInfoDescInfoTA.value().trim();
										Gv.log("emailVal : " + emailVal);
										Gv.log("phoneNumVal : " + phoneNumVal);
										Gv.log("userDescVal : " + userDescVal);

										if(global_pageintegration_header.email_old == emailVal && global_pageintegration_header.phoneNum_old == phoneNumVal && global_pageintegration_header.descInfo_old == userDescVal){
											Gv.msg.info({html:'各项值都未改变,不需要修改!',zIndex : 11000});
											return;
										}
										var checkNoError = true;
										if(!modifyUserInfoEmailEF.validate()){
											checkNoError = false;
										}
//										if(emailVal == null || emailVal == ""){
//											modifyUserInfoEmailEF.setTipsContent('Email不能为空');
//											modifyUserInfoEmailEF.addError();
//											checkNoError = false;
//										}else{
//											var eamilPtn = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
//											if (emailVal != "" && emailVal != null
//													&& !eamilPtn.exec(emailVal)) {
//												modifyUserInfoEmailEF.setTipsContent('不是合法的Email，请重新输入');
//												modifyUserInfoEmailEF.addError();
//												checkNoError = false;
//											}
//										}
										var phoneNumPtn = /^1[3|5|8][0-9]\d{8}$/;
										if (phoneNumVal != "" && phoneNumVal != null
												&& !phoneNumPtn.exec(phoneNumVal)) {
											modifyUserInfoPhoneNumTF.setTipsContent('不是完整的11位手机号或者正确的手机号，请重新输入');
											modifyUserInfoPhoneNumTF.addError();
											checkNoError = false;
										}

										if(userDescVal.length > 128){
											modifyUserInfoDescInfoTA.setTipsContent('描述信息不能超过128个字符，请重新输入');
											modifyUserInfoDescInfoTA.addError();
											checkNoError = false;
										}

										if(!checkNoError){
											return;
										}

//									var tabId = Gv.frameTabPanel.getCurrentTabId();
//									Gv.maskMsg(true, 'tab-content-' + tabId, '加载中，请稍候...');
									Gv.ajax({
													url : '/pageframe/main/modifyUserInfo.action',
													data : {
														email : emailVal,
														phoneNum : phoneNumVal,
														descInfo : userDescVal,
														test : null
													},
													type : 'post',
													async : true,
													dataType : 'json',
													beforeSend:function(){
														canSendRequest = false;
													},
													successFun : function(retVal) {
														canSendRequest = true;
														//Gv.maskMsg(false, 'tab-content-' + tabId, '加载中，请稍候...');
														if(retVal.result){
															modifyUserInfoWin.close();
															Gv.msgNote("操作成功！");

														}else{
															Gv.msg.error({html:retVal.msg,
																zIndex : 11000});
														}
													}
												});

									}
								}, {
									text : '取消',
									handler : function() {
										modifyUserInfoWin.close();
									}
								} ]
					});
			Gv.ajax({
				url : '/pageframe/main/queryLoginUser.action',
				data : {
				},
				type : 'post',
				async : true,
				dataType : 'json',
				beforeSend:function(){
					canSendRequest = false;
				},
				successFun : function(retVal) {
					canSendRequest = true;
					Gv.log(retVal);
					if(retVal.result){
						modifyUserInfoEmailEF.value(retVal.email);
						modifyUserInfoPhoneNumTF.value(retVal.phoneNum);
						modifyUserInfoDescInfoTA.value(retVal.descInfo);

						global_pageintegration_header.email_old = retVal.email;
						global_pageintegration_header.phoneNum_old = retVal.phoneNum;
						global_pageintegration_header.descInfo_old = retVal.descInfo;

					}else{
						Gv.msg.error({html:retVal.msg,
							zIndex : 11000});
					}
				}
			});

		},


		modifyPwd:function(){
			var canSendRequest = true;

			var modifyPwdNewPwd = new Gv.form.Password({
				id : 'modifyPwdNewPwd-id',
				fieldLabel : '<i class="gv-field-required-star">*</i>新密码',
				allowBlank : false,
				blankText : '新密码不能为空',
				emptyText : "请输入新密码"
			});

			var modifyPwdVerifyNewPwd = new Gv.form.Password({
				id : 'modifyPwdVerifyNewPwd-id',
				fieldLabel : '<i class="gv-field-required-star">*</i>确认新密码',
				allowBlank : false,
				blankText : '确认新密码不能为空',
				emptyText : "请输入新密码"
			});


			var modifyPwdForm = new Gv.form.FormPanel({
				id : 'modifyPwdForm-id',
				layout : 'form',// 单列形式form,双列形式column
				items : [ modifyPwdNewPwd,modifyPwdVerifyNewPwd ]
			});

			var modifyPwdWin = new Gv.Window(
					{
						id : 'modifyPwd-id',
						title : '修改个人密码',
						width : 415,
						height : 90,
						bodyStyle : 'padding:10px;',
						items : [ modifyPwdForm ],
						listeners:{
							afterLayout : function() {
								//禁止输入空格
								$("#modifyPwdNewPwd-id").bind('keydown',function(e){
									e=window.event||e;
									if(e.keyCode==32){
										e.keyCode = 0;
										return false;
									}
								});
								$("#modifyPwdVerifyNewPwd-id").bind('keydown',function(e){
									e=window.event||e;
									if(e.keyCode==32){
										e.keyCode = 0;
										return false;
									}
								});
							}
						},
						tbar : [
								{
									text : '确认',
									handler : function(id,text) {
										if(!canSendRequest){
											return;
										}

										var newPwd = modifyPwdNewPwd.value().trim();
										var newPwd2 = modifyPwdVerifyNewPwd.value().trim();

										Gv.log("newPwd : " + newPwd);

										var checkNoError = true;
										if(newPwd == null || newPwd == ""){
											modifyPwdNewPwd.setTipsContent('新密码不能为空');
											modifyPwdNewPwd.addError();
											checkNoError = false;
										}else if(newPwd.length < 6 || newPwd.length > 16){
											modifyPwdNewPwd.setTipsContent('密码由6-16位字符组成');
											modifyPwdNewPwd.addError();
											checkNoError = false;
										}

										if(newPwd2 == null || newPwd2 == ""){
											modifyPwdVerifyNewPwd.setTipsContent('确认新密码不能为空');
											modifyPwdVerifyNewPwd.addError();
											checkNoError = false;
										}else if (newPwd2 != newPwd) {
											modifyPwdVerifyNewPwd.setTipsContent('确认新密码与新密码不一致');
											modifyPwdVerifyNewPwd.addError();
											checkNoError = false;
										}

										if(!checkNoError){
											return;
										}

//									var tabId = Gv.frameTabPanel.getCurrentTabId();
//									Gv.maskMsg(true, 'tab-content-' + tabId, '加载中，请稍候...');
										Gv.get(id).html(Gv.LoadingHtml);
										Gv.ajax({
													url : '/pageframe/main/modifyPwd.action',
													data : {
														newPwd : newPwd
													},
													type : 'post',
													async : true,
													dataType : 'json',
													beforeSend:function(){
														canSendRequest = false;
													},
													successFun : function(retVal) {
														Gv.get(id).html("确定");
														canSendRequest = true;
														//Gv.maskMsg(false, 'tab-content-' + tabId, '加载中，请稍候...');
														modifyPwdWin.close();
														if(retVal.result){
															Gv.msgNote("操作成功！");
														}else{
															Gv.msg.error({html:retVal.msg,
																zIndex : 11000});
														}
													}
												});

									}
								}, {
									text : '取消',
									handler : function() {
										modifyPwdWin.close();
									}
								} ]
					});



		},

		infoConf:function(){

		}


};



