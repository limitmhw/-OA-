/*！
 * 这里的代码用于将不同的类型的表格进行存储
 */
golbal.BASEFunction = {
	getTxtTableData : function () {
		let tdata = $('#clearandreplacecontent').html();
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
		return {
			'tableInfo' : JSON.stringify(tableInfo),
			'tableCtx' : tdata
		};

	},
	getStdTableData : function () {
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
		console.log(JSON.stringify(ttObj));
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
		let excelType = golbal.BASEStatus.getExcelObj().excelType;
		let ttObj = this.getTableData();

		console.log(JSON.stringify({
				'gong_cheng_id' : gong_cheng_id, //golbal.BASEStatus.getProjectObj().projectId,
				'excelType' : excelType,
				'tableType' : golbal.BASEStatus.getTableObj().tableType,
				'tableInfo' : ttObj.tableInfo,
				'tableCtx' : ttObj.tableCtx
			}));
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
	getTableData : function () {
		let tableType = golbal.BASEStatus.getTableObj().tableType;
		if (typeof(tableType) == "undefined") {
			alert('tableType is undefined');
		}
		let flag = false;

		StdTable = [
			"151_002", "152_002", "152_003", "152_004",
			"152_005", "152_006", "152_007", "153_002",
			"154_002", "154_003", "155_002", "155_003",
			"155_004", "155_005", "156_002", "157_002",
			"157_003", "158_002", "158_003", "158_004",
			"159_002", "160_002", "160_003", "161_002",
			"161_003", "162_002"];
		TxtTable = [
			"4_001", "4_002", "4_003", "4_004", "4_005",
			"4_006", "4_007", "4_008", "4_009", "4_010",
			"4_011", "4_012", "4_013", "4_014", "4_015",
			"4_016", "4_017", "4_018", "4_019", "4_020",
			"4_021", "4_022", "4_023", "4_024", "4_025"];

		///
		{
			for (let k = 0; k < StdTable.length; k++) {
				if (StdTable[k] == tableType) {
					flag = true;
					break;
				}
			}
			if (flag == true) {
				return this.getStdTableData();
			}
		}
		///
		{
			for (let k = 0; k < TxtTable.length; k++) {
				if (TxtTable[k] == tableType) {
					flag = true;
					break;
				}
			}
			if (flag == true) {
				return this.getTxtTableData();
			}
		}

	},
	ItemSave1 : function () {
		alert("4_001");
	},
	ItemSave2 : function () {
		alert("4_004");
	},
	ItemSave3 : function () {
		let tdata = $('#clearandreplacecontent').html();
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

		$.ajax({
			type : "POST",
			url : golbal.BASEINFO['SERVER_ROOT'] + "/excel/saveTable.action",
			data : {
				'id' : golbal.BASEStatus.getTableObj().tableId,
				'tableType' : golbal.BASEStatus.getTableObj().tableType,
				'tableInfo' : JSON.stringify(tableInfo),
				'tableCtx' : tdata
			},
			success : function (data) {
				console.log("SAVE-SUCCESS");
				golbal.BASEFunction.afterSave();
			},
			error : function () {
				console.log('cuowu');
			}
		});
	},
	saveTable : function () {
		if (typeof(golbal.BASEStatus.getTableObj().tableType) != "undefined") {
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
