/*！
 * 这里的代码用于将不同的类型的表格进行存储
 */
golbal.BASEFunction = {

	getTableData : function () {
		let tableInfo = {
			xiang_mu_ming_chen_ : $("#clearandreplacecontent div[label='xiang_mu_ming_chen_']").text(),
			biao_dan_bian_hao_ : $("#clearandreplacecontent div[label='biao_dan_bian_hao_']").eq(0).text(),
			tong_ji_ri_qi_nian_ : $("#clearandreplacecontent div[label='tong_ji_ri_qi_nian_']").eq(0).text(),
			tong_ji_ri_qi_yue_ : $("#clearandreplacecontent div[label='tong_ji_ri_qi_yue_']").eq(0).text(),
			dan_wei_ : $("#clearandreplacecontent div[label='dan_wei_']").eq(0).text(),
			bian_zhi_ren_ : $("#clearandreplacecontent div[label='bian_zhi_ren_']").eq(0).text(),
			bian_zhi_ren_nian_ : $("#clearandreplacecontent div[label='bian_zhi_ren_nian_']").eq(0).text(),
			bian_zhi_ren_yue_ : $("#clearandreplacecontent div[label='bian_zhi_ren_yue_']").eq(0).text(),
			bian_zhi_ren_ri_ : $("#clearandreplacecontent div[label='bian_zhi_ren_ri_']").eq(0).text(),
			shen_he_ren_ : $("#clearandreplacecontent div[label='shen_he_ren_']").eq(0).text(),
			shen_he_ren_nian_ : $("#clearandreplacecontent div[label='shen_he_ren_nian_']").eq(0).text(),
			shen_he_ren_yue_ : $("#clearandreplacecontent div[label='shen_he_ren_yue_']").eq(0).text(),
			shen_he_ren_ri_ : $("#clearandreplacecontent div[label='shen_he_ren_ri_']").eq(0).text(),
			shen_pi_ren_ : $("#clearandreplacecontent div[label='shen_pi_ren_']").eq(0).text(),
			shen_pi_ren_nian_ : $("#clearandreplacecontent div[label='shen_pi_ren_nian_']").eq(0).text(),
			shen_pi_ren_yue_ : $("#clearandreplacecontent div[label='shen_pi_ren_yue_']").eq(0).text(),
			shen_pi_ren_ri_ : $("#clearandreplacecontent div[label='shen_pi_ren_ri_']").eq(0).text()
		};

		let html_obj = $("#clearandreplacecontent tr[TableType='ctx']");
		let tr_obj = {};
		let submit_tr = [];
		html_obj.each(function () {
			var tem = 0;
			//过滤空行
			$(this).each(function (k) {
				if ($.trim($(this).text()) != "") {
					tem += 1;
				}
			});
			if (tem == 0) {
				$(this).remove();
			} else {
				submit_tr.push($(this));
			}
		});
		$.each(submit_tr, function (i) {

			var tds = $(this).find('td');
			var td_obj = {};
			tds.each(function (k) {
				td_obj[k] = $(this).text();
			})
			td_obj['tr_id'] = $(this).attr('tr_id');

			if ($(this).attr('istitle') == 'istitle') {
				switch ($(this).attr('level')) {
				case "1": {
						td_obj['trType'] = 'TITLELEVEL1';
						break;
					}
				case "2": {
						td_obj['trType'] = 'TITLELEVEL2';
						break;
					}
				case "3": {
						td_obj['trType'] = 'TITLELEVEL3';
						break;
					}
				default: {
						break;
					}
				}
			}

			tr_obj[i] = td_obj;

		})
		return {
			'tableInfo' : JSON.stringify(tableInfo),
			'tableCtx' : JSON.stringify(tr_obj)
		};
	},
	tableSaveBase : function () {

		let ttObj = this.getTableData();
		if (typeof(golbal.BASEStatus.getTableObj().tableId) == "undefined") {
			alert("nothing to save");
			console.log("nothing to save");
			return;
		}
		$.ajax({
			type : "POST",
			url : golbal.BASEINFO['SERVER_ROOT'] + "/excel/saveTable.action",
			data : {
				'id' : golbal.BASEStatus.getTableObj().tableId,
				'tableType' : golbal.BASEStatus.getTableObj().tableType,
				'tableInfo' : ttObj.tableInfo,
				'tableCtx' : ttObj.tableCtx
			},
			success : function (data) {

				console.log("SAVE-SUCCESS");
				golbal.BASEFunction.afterSave();

			},
			complete : function () {
				////刷新当前栏目的菜单
				////$(".btn-list-select").trigger("click");
			},
			error : function () {
				console.log('cuowu');
			}
		});
	},
	saveNewTableAndExcel : function () {
		let gong_cheng_id = 1;
		let excelType = golbal.BASEStatus.getExcelObj().excelType

			let ttObj = this.getTableData();
		$.ajax({
			type : "post",
			url : golbal.BASEINFO['SERVER_ROOT'] + "/excel/createExcelAndSaveTable.action",
			data : {
				'gong_cheng_id' : gong_cheng_id, //golbal.BASEStatus.getProjectObj().projectId,
				'excelType' : excelType,
				'tableType' : golbal.BASEStatus.getTableObj().tableType,
				'tableInfo' : ttObj.tableInfo,
				'tableCtx' : ttObj.tableCtx
			},
			success : function (data) {
				console.log(data);
				golbal.BASEFunction.afterSave();

			},
			complete : function () {
				////刷新当前栏目的菜单
				$(".btn-list-select").trigger("click");
			},
			error : function () {
				console.log('创建表单失败');
			}
		});
	},
	afterSave : function () {
		//重新触发载刷当前表格
		$('#table_nav li[nowHandleTable="nowHandleTable"]').trigger('click');
		//重新触发载刷新当前菜单
		$(".btn-list-select").trigger("click");
	},
	typeHandle : function (tableType) {
		switch (tableType) {
		case "4_001": {
				this.ItemSave1();
				break;
			}
		case "4_004": {
				this.ItemSave2();
				break;
			}
		default: {
				break;
			}
		}

	},
	ItemSave1 : function () {
		alert("4_001")
	},
	ItemSave2 : function () {
		alert("4_004")
	},
	saveTable : function () {
		if (typeof(golbal.BASEStatus.getTableObj().tableType) != "undefined") {
			this.typeHandle(golbal.BASEStatus.getTableObj().tableType);
			if (typeof(golbal.BASEStatus.getTableObj().tableId) == "undefined") {
				this.saveNewTableAndExcel();
				return;
			} else {
				this.tableSaveBase();
			}
			//不应该在这里调用
			//应该在完成的时候调用
			//否则刷新时间对不上
		} else {
			alert("表格类型丢失！");
		}

	}

}
