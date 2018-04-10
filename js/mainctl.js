


$(function () { {
		golbal.now_menu = {};
		golbal.BASEINFO = {};
		//全局量设置
		var renYuanId;
		var SERVER_ROOT;
		var pro_id; //全局变量：项目对应的id,当操作的是项目注册表的时候，pro_id和now_operate_tab将是同一个。
		var now_operate_tab = 'xiang_mu_xin_xi_'; //全局变量，正在操作的表的名称，初始化的时候，对应于项目注册表。
		var now_operate_tab_item_id; //正在在操作的表的的id，初始化的时候因为是项目注册表，这时候整在操作的表的id 就等于是项目的id
		var fun_btn; ////表示左侧13项，初始默认等于组织与策划
		var center; ////表示五中不同的中心，初始等于工作中心

		const ipcRenderer = require('electron').ipcRenderer;
		ipcRenderer.send('getbaseinfo', 'ping');
		ipcRenderer.on('getbaseinfo-reply', function (event, arg) {
			console.log(arg);
			golbal.BASEINFO = eval("(" + arg + ")");
			console.log(golbal.BASEINFO); // prints "pong"
			renYuanId = golbal.BASEINFO["renYuanId"];
			SERVER_ROOT = golbal.BASEINFO['SERVER_ROOT'];
			pro_id = golbal.BASEINFO['pro_id'];

			golbal.BASEStatus.switchProject(golbal.BASEINFO['pro_id']);
			now_operate_tab_item_id = pro_id;
			fun_btn = golbal.BASEINFO['fun_btn'];
			center = golbal.BASEINFO['center'];
		});

	}

	function init_layout(l1, l2, l3) {
		//控制layout="2"内部div的布局
		if (l1 > 1) {
			l1 = 35; // (45 * 100) / parseInt($('div[layout="2"]').width());
		}
		if (l2 > 1) {
			l2 = 206; //(205 * 100) / parseInt($('div[layout="2"]').width());
		}
		if (l3 == -1) {
			l3 = $('div[layout="2"]').width() - l1 - l2;
		}
		$('div[layout="2.1"]').css({
			"width" : l1,
			"left" : "0%",
		});
		$('div[layout="2.2"]').css({
			"width" : l2,
			"left" : l1,
		});
		$('div[layout="2.3"]').css({
			"width" : l3,
			"left" : (l1 + l2),
		});
		//处理宽度为0的bug，让宽度为0的隐藏
		div_arr = ['div[layout="2.1"]', 'div[layout="2.2"]', 'div[layout="2.3"]'];
		for (k in div_arr) {
			if ($(div_arr[k]).width() == 0) {
				$(div_arr[k]).hide();
			} else {
				$(div_arr[k]).show();
			}
		}
		//布局影响表格的位置，这里重新刷新表格
		if (golbal.pp.arr_pages.length > 0) {
			golbal.pp.refreshPosition();
		}

	}
	function start_full_screen() {
		//控制全屏
		init_layout(0, 0, -1);
		$('.float-menu').show();
		//主动触发缩放到自适应状态
		$(".scale-option").val("-1");
		$(".scale-option").trigger("change");
	}
	function stop_full_screen() {
		//控制取消全屏的
		init_layout(3.4, 15, -1);
		$('.float-menu').hide();
		//主动触发缩放到自适应状态
		$(".scale-option").val("-1");
		$(".scale-option").trigger("change");
	}
	function setTable(cc_tabel_head, cc_table_foot, style) {
		golbal.pp.setTableHead(cc_tabel_head);
		golbal.pp.setTableFoot(cc_table_foot);
		golbal.pp.run(style);
	}
	//与表格的表头表尾布局有关的代码
	function colFuncHead1(title) {
		var cc = '\
																																																																																																																																																																					<div style="position:absolute;left:74px;top:60px;font-size:10pt;">项目名称：</div>\
																																																																																																																																																																					<div label="xiang_mu_ming_chen_" class="forEdit" style="position:absolute;left:144px;top:60px;font-size:10.5pt;width:100px;" contenteditable="true"></div>\
																																																																																																																																																																					<div style="position:absolute;left:300px;top:10px;">\
																																																																																																																																																																					<font     style="font-size: 22pt;font-weight: 700;font-style: normal;\
																																																																																																																																																																					font-family: 宋体;text-decoration: none;">\
																																																																																																																																																																					' + title + '</font></div>\
																																																																																																																																																																					<div style="position:absolute;left:74px;top:28px;font-size:10.5pt;">表单编号：</div>\
																																																																																																																																																																					<div label="biao_dan_bian_hao_" class="forEdit"  style="position:absolute;left:144px;top:28px;font-size:10.5pt;width:100px;" contenteditable="true"></div>';
		return cc;
	}
	function colFuncFoot1() {
		var cc = '<div style="float:left;">编制\\日期：</div>\
																																																																																																																																																															<div label="bian_zhi_ren_" class="forEdit"style="float:left;font-size:10.5pt;width:60px;" contenteditable="true"></div>\
																																																																																																																																																															<div label="bian_zhi_ren_nian_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																															<div style="float:left;">年</div>\
																																																																																																																																																															<div label="bian_zhi_ren_yue_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																															<div style="float:left;">月</div>\
																																																																																																																																																															<div label="bian_zhi_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																															<div style="float:left;">日</div>\
																																																																																																																																																															<div style="float:left;width:40px;">&nbsp</div>\
																																																																																																																																																															<div style="float:left;">审核\\日期：</div>\
																																																																																																																																																															<div label="shen_he_ren_" class="forEdit" style="float:left;font-size:10.5pt;width:60px;" contenteditable="true"></div>\
																																																																																																																																																															<div label="shen_he_ren_nian_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																															<div style="float:left;">年</div>\
																																																																																																																																																															<div label="shen_he_ren_yue_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																															<div style="float:left;">月</div>\
																																																																																																																																																															<div label="shen_he_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																															<div style="float:left;">日</div>';
		return cc;

	}
	function rowFuncTitle(title) {
		var title_width = 29 * title.length; //$(".tab-title").width();
		/*
		$(".tab-title").css({
		"top" : "10px",
		"left" : "50%",
		"margin-left" : -title_width / 2 + "px"
		});
		 */
		var cc = '<div style="position:absolute;top:10px;left:50%;margin-left:' + -title_width / 2 + 'px;" class="tab-title">\
																																																																																																																																																																					<font     style="font-size: 29px;font-weight: 700;font-style: normal;\
																																																																																																																																																																					font-family: 宋体;text-decoration: none;">\
																																																																																																																																																																					' + title + '</font></div>';
		return cc;
	}
	function rowFuncLeftTitleHead2(title) {
		var cc = '<div style="position:absolute;left:74px;top:28px;font-size:10.5pt;">' + title + '：</div>\
																																																																																																																																																																					<div label="biao_dan_bian_hao_" class="forEdit"  style="position:absolute;left:144px;\
																																																																																																																																																																					top:28px;font-size:10.5pt;width:200px;" contenteditable="true"></div>';
		return cc;
	}
	function rowFuncLeftTitleHead3(title) {
		var ll = 13 * title.length + 90;
		var cc = '\
																																																																																																																																																																					<div style="position:absolute;left:74px;top:60px;font-size:10pt;">' + title + '：</div>\
																																																																																																																																																																					<div label="xiang_mu_ming_chen_" class="forEdit" style="position:absolute;left:' + ll + 'px;top:60px;\
																																																																																																																																																																					font-size:10.5pt;width:200px;" contenteditable="true"></div>';
		return cc;
	}
	function rowFuncRightTitleHead1(title) {
		var cc = '<div label="dan_wei_" class="forEdit"  style="position:absolute;left:1010px;top:60px;font-size:10.5pt;width:60px;" contenteditable="true"></div>\
																																																																																																																																																																					<div style="position:absolute;left:970px;top:60px;font-size:10pt;">' + title + '：</div>';
		return cc;
	}
	function rowFuncMiddleTitleHead(title) {
		var cc = '<div style="position:absolute;left:374px;top:60px;font-size:10.5pt;">' + title + '</div>\
																																																																																																																																																																					<div label="tong_ji_ri_qi_nian_" class="forEdit"  style="position:absolute;left:470px;top:60px;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																					<div style="position:absolute;left:520px;top:60px;font-size:10pt;">年</div>	\
																																																																																																																																																																					<div label="tong_ji_ri_qi_yue_" class="forEdit"  style="position:absolute;left:550px;top:60px;font-size:10.5pt;width:40px;" contenteditable="true"></div>\
																																																																																																																																																																					<div style="position:absolute;left:600px;top:60px;font-size:10pt;">月</div>	'
			return cc;
	}
	function rowFuncHead1(title) {
		var cc = rowFuncLeftTitleHead3('项目名称')
			+rowFuncTitle(title)
			+rowFuncLeftTitleHead2('表单编号')
			+rowFuncRightTitleHead1('单位');
		return cc;
	}
	function rowFuncHead2(title) {
		var cc = rowFuncLeftTitleHead3('项目名称—单项工程')
			+rowFuncTitle(title)
			+rowFuncLeftTitleHead2('表单编号')
			+rowFuncRightTitleHead1('单位');
		return cc;
	}
	function rowFuncHead3(title) {
		var cc = rowFuncLeftTitleHead3('项目名称—单项工程—专业类别')
			+rowFuncTitle(title)
			+rowFuncRightTitleHead1('单位');
		return cc;
	}
	function rowFuncHead4(title) {
		var cc = rowFuncLeftTitleHead3('项目名称—单项工程')
			+rowFuncTitle(title)
			+rowFuncLeftTitleHead2('表单编号')
			+rowFuncRightTitleHead1('单位');
		return cc;
	}
	function rowFuncHead5(title) {
		var cc = rowFuncLeftTitleHead3('项目名称')
			+rowFuncTitle(title)
			+rowFuncLeftTitleHead2('表单编号')
			+rowFuncMiddleTitleHead('统计月份')
			+rowFuncRightTitleHead1('单位');
		return cc;
	}
	function rowFuncHead6(title) {
		var cc = rowFuncLeftTitleHead3('项目名称—单项工程')
			+rowFuncTitle(title)
			+rowFuncLeftTitleHead2('表单编号')
			+rowFuncMiddleTitleHead('统计月份')
			+rowFuncRightTitleHead1('单位');
		return cc;
	}
	function rowFuncHead7(title) {
		var cc = rowFuncLeftTitleHead3('项目名称—单项工程')
			+rowFuncTitle(title)
			+rowFuncLeftTitleHead2('表单编号')
			+rowFuncRightTitleHead1('单位');
		return cc;
	}
	function rowFuncHead8(title) {
		var cc = rowFuncLeftTitleHead3('项目名称')
			+rowFuncTitle(title)
			+rowFuncMiddleTitleHead('统计日期');
		return cc;
	}
	function rowFuncFoot1() {
		var cc = '<div style="float:left;">编制\\日期：</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_" class="forEdit"style="float:left;font-size:10.5pt;width:80px;" contenteditable="true"></div>\
																																																																																																																																																																						<div label="bian_zhi_ren_nian_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">年</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_yue_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">月</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">日</div>\
																																																																																																																																																																						<div style="float:left;width:20px;">&nbsp</div>\
																																																																																																																																																																						<div style="float:left;">审核\\日期：</div>\
																																																																																																																																																																						<div label="shen_he_ren_" class="forEdit" style="float:left;font-size:10.5pt;width:80px;" contenteditable="true"></div>\
																																																																																																																																																																						<div label="shen_he_ren_nian_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">年</div>\
																																																																																																																																																																						<div label="shen_he_ren_yue_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">月</div>\
																																																																																																																																																																						<div label="shen_he_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">日</div>\
																																																																																																																																																																						<div style="float:left;width:20px;">&nbsp</div>\
																																																																																																																																																																						<div style="float:left;">审批\\日期：</div>\
																																																																																																																																																																						<div label="shen_pi_ren_" class="forEdit" style="float:left;font-size:10.5pt;width:80px;" contenteditable="true"></div>\
																																																																																																																																																																						<div label="shen_pi_ren_nian_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">年</div>\
																																																																																																																																																																						<div label="shen_pi_ren_yue_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">月</div>\
																																																																																																																																																																						<div label="shen_pi_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:30px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">日</div>';
		return cc;
	}
	function rowFuncFoot2() {
		var cc = '<div style="float:left;">编制人：</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_" class="forEdit"style="float:left;font-size:10.5pt;width:160px;" contenteditable="true"></div>\
																																																																																																																																																																						<div label="bian_zhi_ren_nian_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">年</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_yue_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">月</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">日</div>\
																																																																																																																																																																						<div style="float:left;width:100px;">&nbsp</div>\
																																																																																																																																																																						<div style="float:left;">审核人：</div>\
																																																																																																																																																																						<div label="shen_he_ren_" class="forEdit" style="float:left;font-size:10.5pt;width:160px;" contenteditable="true"></div>\
																																																																																																																																																																						<div label="shen_he_ren_nian_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">年</div>\
																																																																																																																																																																						<div label="shen_he_ren_yue_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">月</div>\
																																																																																																																																																																						<div label="shen_he_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">日</div>';
		return cc;
	}
	function rowFuncFoot3() {
		var cc = '<div style="float:left;">编制人：</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_" class="forEdit"style="float:left;font-size:10.5pt;width:160px;" contenteditable="true"></div>\
																																																																																																																																																																						<div label="bian_zhi_ren_nian_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">年</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_yue_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">月</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">日</div>\
																																																																																																																																																																						<div style="float:left;width:100px;">&nbsp</div>\
																																																																																																																																																																						<div style="float:left;">审核/日期：</div>\
																																																																																																																																																																						<div label="shen_he_ren_" class="forEdit" style="float:left;font-size:10.5pt;width:160px;" contenteditable="true"></div>\
																																																																																																																																																																						<div label="shen_he_ren_nian_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">年</div>\
																																																																																																																																																																						<div label="shen_he_ren_yue_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">月</div>\
																																																																																																																																																																						<div label="shen_he_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">日</div>';
		return cc;
	}
	function rowFuncFoot4() {
		var cc = '<div style="float:left;">编制\\日期：</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_" class="forEdit"style="float:left;font-size:10.5pt;width:160px;" contenteditable="true"></div>\
																																																																																																																																																																						<div label="bian_zhi_ren_nian_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">年</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_yue_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">月</div>\
																																																																																																																																																																						<div label="bian_zhi_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">日</div>\
																																																																																																																																																																						<div style="float:left;width:100px;">&nbsp</div>\
																																																																																																																																																																						<div style="float:left;">审核\\日期：</div>\
																																																																																																																																																																						<div label="shen_he_ren_" class="forEdit" style="float:left;font-size:10.5pt;width:160px;" contenteditable="true"></div>\
																																																																																																																																																																						<div label="shen_he_ren_nian_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">年</div>\
																																																																																																																																																																						<div label="shen_he_ren_yue_"class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">月</div>\
																																																																																																																																																																						<div label="shen_he_ren_ri_" class="forEdit" style="text-align:center;float:left;font-size:10.5pt;width:50px;" contenteditable="true"></div>\
																																																																																																																																																																						<div style="float:left;">日</div>';
		return cc;
	}
	function handleSPPage(model) {
		var model = arguments[0] ? arguments[0] : "col"; //设置参数b的默认值为 "col"

		golbal.spp.run(model);
		return;
	}
	function selectTable(template_tab) {
		template_tab = template_tab.replace(/\//g, "_");
		template_tab = template_tab.replace(/-/g, "_");
		template_tab = template_tab.replace(/\./g, "_");
		console.log('Template_tab:' + template_tab);
		console.log('工程成本责'.length);

		switch (template_tab) {
		case 'AZ_AZ_05_005_001_htm': {
				handleSPPage();
				break;
			}
		case 'AZ_AZ_05_005_002_htm': {
				handleSPPage();
				break;
			}
		case 'AZ_AZ_05_005_003_htm': {
				handleSPPage();
				break;
			}
		case 'AZ_AZ_05_005_004_htm': {
				handleSPPage('row');
				break;
			}
		case 'AZ_AZ_05_005_005_htm': {
				console.log('1.2承包范围');
				var cc = rowFuncHead1('(2) 工程承包范围明细表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_006_htm': {

				console.log('2.1管理目标');
				var cc = rowFuncHead1('(3) 项目管理目标表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");

				break;
			}
		case 'AZ_AZ_05_005_007_htm': {

				console.log('2.2节点计划');
				var cc = rowFuncHead1('(7) 工程里程碑节点计划表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_008_htm': {
				handleSPPage('row');
				break;
			}
		case 'AZ_AZ_05_005_009_htm': {
				console.log('3.2人员配置');
				var cc = rowFuncHead1('(5) 人员配置及流量表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_010_htm': {
				console.log('3.3授权书');
				var cc = rowFuncHead1('(6) 项目经理授权清单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_011_htm': {
				console.log('4.1技术方案选择');
				var cc = rowFuncHead1('(11) 技术方案选择清单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_012_htm': {
				// 这里可以针对性的选择行高
				golbal.BASEStatus.stdTrHeight = 140;
				console.log('5.1分包选择方案');
				var cc = rowFuncHead1('(12) 分包选择方案清单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_013_htm': {
				console.log('5.2物资采购方案');
				var cc = rowFuncHead1('(13) 物资采购方案清单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_014_htm': {
				console.log('5.3机械配置方案');
				var cc = rowFuncHead1('(14) 机械配置方案清单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_015_htm': {
				handleSPPage('row');
				break;
			}
		case 'AZ_AZ_05_005_016_htm': {
				console.log('6.1现场临建方案');
				var cc = rowFuncHead1('(17) 现场临建设置方案表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_017_htm': {
				console.log('6.2临水临电方案');
				var cc = rowFuncHead1('(18) 临水临电设置方案表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_018_htm': {
				console.log('6.3监测设备配置方案');
				var cc = rowFuncHead1('(15) 监测设备配置方案表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_019_htm': {
				console.log('6.4办公设备配置');
				var cc = rowFuncHead1('(16) 办公设备配置方案表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_020_htm': {
				console.log('7.1总成本控制');
				var cc = rowFuncHead1('（8）工程总成本预算表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_021_htm': {
				console.log('7.1-1管理费预算');
				var cc = rowFuncHead1('(9) 现场管理费预算表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_022_htm': {
				console.log('8.1现金流量预算');
				var cc = rowFuncHead1('(19) 资金收支预算汇总表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_023_htm': {
				console.log('8.1-1预算流入');
				var cc = rowFuncHead1('(20) 工程款回收预算表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_024_htm': {
				console.log('8.1-2.预算流出');
				var cc = rowFuncHead1('(21) 工程款支付预算表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'AZ_AZ_05_005_025_htm': {

				console.log('（10）管理文件编制计划表');
				var cc = rowFuncHead1('（10）管理文件编制计划表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");

				break;
			}
		case 'JZ_JZ_01_151_sheet002_htm': {
				//（JZ-01-151）工程成本责任表 目标责任表
				var cc = colFuncHead1('工程成本责任表');
				var cc2 = colFuncFoot1();
				setTable(cc, cc2, "col");
				break;
			}

		case 'JZ_JZ_02_152_sheet002_htm': {
				//（JZ-02-152）工程成本测算表 工程项目
				var cc = rowFuncHead1('工程预算成本测算清单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}

		case 'JZ_JZ_02_152_sheet003_htm': {
				//（JZ-02-152）工程成本测算表 单项工程
				var cc = rowFuncHead2('工程预算成本测算清单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}

		case 'JZ_JZ_02_152_sheet004_htm': {
				//（JZ-02-152）工程成本测算表 1-1分包工程测算表
				var cc = rowFuncHead2('分包工程预算成本测算表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_02_152_sheet005_htm': {
				//（JZ-02-152）工程成本测算表 1-2材料设备测算表
				var cc = rowFuncHead3('材料设备预算成本测算表');
				var cc2 = '';
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_02_152_sheet006_htm': {
				//（JZ-02-152）工程成本测算表 1-3机械与材料租赁测算表
				var cc = rowFuncHead2('机械材料租赁预算成本测算表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_02_152_sheet007_htm': {
				//（JZ-02-152）工程成本测算表 1-4管理费及其它测算表
				var cc = rowFuncHead2('现场经费预算成本测算表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_03_153_sheet002_htm': {
				//（JZ-03-153）工程成本调整表 预算成本调整表
				var cc = rowFuncHead1('工程预算成本调整表');
				var cc2 = rowFuncFoot2();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_04_154_sheet002_htm': {
				//（JZ-04-154）工程成本计划表 工程项目
				var cc = rowFuncHead1('工程成本计划表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_04_154_sheet003_htm': {
				//（JZ-04-154）工程成本计划表 工程项目
				var cc = rowFuncHead2('工程成本计划表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}

		case 'JZ_JZ_05_155_sheet002_htm': {
				//（JZ-04-155）工程成本控制表 工程项目
				var cc = rowFuncHead1('工程成本计划表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_05_155_sheet003_htm': {
				//（JZ-04-155）工程成本控制表 单项工程
				var cc = rowFuncHead2('工程成本计划表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_05_155_sheet004_htm': {
				//（JZ-04-155）工程成本控制表 1-1机械与材料租赁
				var cc = rowFuncHead5('租赁/摊销过程成本计算表');
				var cc2 = rowFuncFoot4();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_05_155_sheet005_htm': {
				//（JZ-04-155）工程成本控制表 1-2管理费及其它
				var cc = rowFuncHead5('管理费/其它过程成本计算表');
				var cc2 = rowFuncFoot4();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_06_156_sheet002_htm': {
				//（JZ-04-156）物资成本控制表 过程控制表
				var cc = rowFuncHead5('物资成本过程控制表');
				var cc2 = rowFuncFoot4();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_07_157_sheet002_htm': {
				//（JZ-07-157）工程成本核算表
				var cc = rowFuncHead5('工程成本核算表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_07_157_sheet003_htm': {
				//（JZ-07-157）工程成本核算表-单项工程
				var cc = rowFuncHead6('工程成本核算表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_08_158_sheet002_htm': {
				//（JZ-08-158）月工程成本确认单
				var cc = rowFuncHead7('月工程成本确认单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_08_158_sheet003_htm': {
				//（JZ-08-158）月物资成本确认单
				var cc = rowFuncHead7('月物资成本确认单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_08_158_sheet004_htm': {
				//（JZ-08-158）月租赁成本确认单
				var cc = rowFuncHead7('月租赁成本确认单');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_09_159_sheet002_htm': {
				//（JZ-09-159）工程成本综合分析表
				var cc = rowFuncHead8('工程成本责任分析表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_10_160_sheet002_htm': {
				//（JZ-10-160）工程成本过程控制表  项目
				var cc = rowFuncHead1('工程成本过程控制表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_10_160_sheet003_htm': {
				//（JZ-10-160）工程成本过程控制表 单项工程
				var cc = rowFuncHead1('工程成本过程控制表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}

		case 'JZ_JZ_11_161_sheet002_htm': {
				//（JZ-11-161）主要物资成本分析表  汇总统计
				var cc = rowFuncHead6('主要物资成本分析表');
				var cc2 = rowFuncFoot4();
				setTable(cc, cc2, "row");
				break;
			}
		case 'JZ_JZ_11_161_sheet003_htm': {
				//（JZ-11-161）主要物资成本分析表  月度统计
				var cc = rowFuncHead6('主要物资成本分析表');
				var cc2 = rowFuncFoot4();
				setTable(cc, cc2, "row");
				break;
			}

		case 'JZ_JZ_12_162_sheet002_htm': {
				//（JZ-12-162）工程项目利润预测表
				var cc = rowFuncHead1('项目利润预测表');
				var cc2 = rowFuncFoot1();
				setTable(cc, cc2, "row");
				break;
			}
		default: {
				console.log('没有匹配');
			}
		}
		//jQuery将表题居中
		//直接计算得到的居中有一点点歪，容易被看出来

		var title_width = $(".tab-title").width();
		$(".tab-title").css({
			"top" : "10px",
			"left" : "50%",
			"margin-left" : -title_width / 2 + "px"
		});

	}

	function get_tab_trees(fun_btn, center, pro_id) {
		/*
		 *获取树形菜单
		 *需要传递三个参数
		 *fun_btn：表示左侧表单分类的大类
		 *center：表中五中不同的中心分类
		 *proid：表示项目id；
		 */

		$.ajax({
			type : "GET",
			url : golbal.BASEINFO['SERVER_ROOT'] + "/excel/get_ooMenu.action",
			data : {
				modelId : fun_btn
			},
			success : function (data) {
				$("#menu2").html(data);
				console.log("CreateExcel-SUCCESS");
			},
			complete : function () {},
			error : function () {
				console.log('获取菜单失败');
			}
		});
	}
	function getTemplateByExcelType(excelType) {
		//这里应该从缓存的OBJ里面取

		let retdata;
		$.ajax({
			type : "GET",
			async : false,
			url : golbal.BASEINFO['SERVER_ROOT'] + "/excel/get_excelTypeTemplate.action",
			data : {
				excelType : excelType
			},
			success : function (data) {
				retdata = (data);

			},
			complete : function () {},
			error : function () {
				console.log('获取菜单失败');
			}
		});
		return retdata;
	}

	function findParentNode(id) {
		//查找菜单的父节点
		function find_node(obj, li_id) {
			//这里可以用用13个第一级别的直接跳过
			if (obj.li_id == li_id && obj.li_id) {
				if (obj.li_type == 'fixed') {
					return obj;
				}
			}
			if (obj.submenu && obj.submenu.length != 0) {
				for (var i in obj.submenu) {
					var ret = find_node(obj.submenu[i], li_id);
					if (ret != -1) {
						return ret;
					}
				}
			}
			return -1;
		}

		return function (id) {
			var ret = -1;
			for (var i in golbal.allmenu) {
				ret = find_node(golbal.allmenu[i], id);
				if (ret != -1)
					return ret;
			}
			return ret;
		}
		(id)
	}
	function updateJsonMenu(obj, cc) {
		//载入json的菜单，输出li菜单
		var uu = $("<ul style='padding-left:7px;'></ul>");
		if (typeof(obj.submenu) != "undefined" && obj.submenu.length != 0) {
			for (var i in obj.submenu) {
				var ll = $('<li></li>');
				var img = $('<img src="./images/folder.png" \
																																																																																																																style = "-moz-box-sizing: border-box; -webkit-box-sizing:\
																																																																																																																					border-box; border: 0; box-sizing: border-box; \
																																																																																																																					vertical-align: middle;" > ');
				////////////////////////////控制图标
				if (obj.submenu[i].icon == 'sub1') {
					img.attr('src', './images/folder.png');

					if (obj.submenu[i].submenu.length == 1) {
						ll.attr('emptyFile', "true");
						ll.attr("layout", "click");
						img.attr('src', './images/file.png');
					}
				} else if (obj.submenu[i].icon == 'sub2') {
					ll.attr('emptyFile', "true");
					ll.attr("layout", "click");
					img.attr('src', './images/file.png');
				} else {
					ll.attr("layout", "click");
					img.attr('src', './images/file2.png');
				}
				////////////////////////////
				{
					//这里可以添加特定的条目内容
					for (var k in obj.submenu[i]) {
						if (k == 'submenu') {
							continue;
						}
						if (k == 'template_tab') {
							if (obj.submenu[i][k].length > 0) {
								ll.attr(k, obj.submenu[i][k][0].template);
							}
							continue;
						}
						ll.attr(k, obj.submenu[i][k]);
					}
					ll.attr('id', ll.attr('template_tab'));
				}

				ll.append(img);
				uu.append(ll.append($('<span spanType="Item"></span>').append(obj.submenu[i].title)));
				ll = updateJsonMenu(obj.submenu[i], ll);
			}
			cc = cc.append(uu);
		}
		$(cc).attr("cid", obj.id);
		return cc;
	}
	function loadTablePage(template_path) {
		let table_id;
		if (golbal.BASEStatus.canUseTbale()) {
			table_id = golbal.BASEStatus.getTableObj().tableId;

		}

		function loadTableTemplate(resolve, reject) {
			$.ajax({
				type : "GET",
				url : "./tabs/" + template_path,
				success : function (data) {
					$("#clearandreplacecontent").empty();
					$("#clearandreplacecontent").html(data);
					//这里需要确定Std_tr
					var std_tr_obj = $("#clearandreplacecontent").find('table[TableType="ctx"]');
					//表格模板数据获取
					var std_tr = std_tr_obj.html();
					std_tr_obj.remove();
					try {
						std_tr = std_tr.replace(/<tbody>/g, "");
						std_tr = std_tr.replace(/<\/tbody>/g, "");
					} catch (err) {
						console.log("替换失败");
					}
					//网络载入基本数据
					resolve($(std_tr));

				},
				error : function () {
					console.log('cuowu');
				}
			});
		}
		function loadTableData(resolve, reject) {

			if (typeof(table_id) == 'undefined' || $.trim(table_id).length == 0) {
				//如果tableId为空
				//直接返回一个空表有的结构
				//可以配置联动初始化参数
				console.log(golbal.BASEINFO.pro_name);
				let init_data = {
					"xiang_mu_ming_chen_" : golbal.BASEINFO.pro_name,
					"biao_dan_bian_hao_" : "",
					"tong_ji_ri_qi_nian_" : "",
					"tong_ji_ri_qi_yue_" : "",
					"dan_wei_" : "",
					"bian_zhi_ren_" : "",
					"bian_zhi_ren_nian_" : "",
					"bian_zhi_ren_yue_" : "",
					"bian_zhi_ren_ri_" : "",
					"shen_he_ren_" : "",
					"shen_he_ren_nian_" : "",
					"shen_he_ren_yue_" : "",
					"shen_he_ren_ri_" : "",
					"shen_pi_ren_" : "",
					"shen_pi_ren_nian_" : "",
					"shen_pi_ren_yue_" : "",
					"shen_pi_ren_ri_" : "",
					"tr_info" : []
				};
				resolve("["+JSON.stringify(init_data)+"]");
			} else {

				$.ajax({
					type : "GET",
					url : SERVER_ROOT + "/excel/getTable.action?id=" + table_id,
					success : function (data) {
						resolve(data)
					},
					error : function () {
						console.log('cuowu');
					}
				});
			}

		}
		//加载表格模板
		var a = new Promise(loadTableTemplate);
		//加载表格数据
		var b = new Promise(loadTableData);
		var p = Promise.all([a, b]);
		//并发处理
		p.then(function (val) {
			var std_tr = val[0];
			var data = val[1];

			std_tr = $(std_tr);
			golbal.BASEStatus.stdTr = std_tr.clone();
			std_tr.attr("tr_id", "");

			let ttem;
			try {
				ttem = eval('(' + data + ')');
			} catch (err) {
				////////////////////////
				///这里暴力插入处理TXT类型的表格
				$("#clearandreplacecontent").empty();
				$("#clearandreplacecontent").append(data);
				return;
				////////////////////////
			}

			var tableObj = ttem[0];

			for (var key in tableObj) {
				//table信息注入
				if (key != 'tr_info') {
					var ii = '<input iidata="' + key + '" class="forinit" type="hidden" value="' + tableObj[key] + '">';
					$("#clearandreplacecontent").append(ii);
				}
			}

			var cc_arr = tableObj.tr_info;

			if (cc_arr.length == 0) {
				//数据表为空
				console.log('数据表为空');

				for (var i = 0; i < 1; i++) {
					var tem = std_tr.clone();
					$("#clearandreplacecontent").append(tem);
				}

			} else {
				//数据表不为空
				//这里加入对内容的处理
				console.log('数据表不为空');
				function findOrderTr(idx) {
					for (var i in cc_arr) {
						if (idx == cc_arr[i].tr_order)
							return cc_arr[i];
					}
					alert("BUG:找不到对应order的tr");
					return -1;
				}
				for (var i = 0; i < cc_arr.length; i++) {
					/*
					//为了兼容表格联动
					var oo = findOrderTr(i);
					if (oo == -1) {
						continue;
					}
					/*/
					var oo=cc_arr[i];
					var tem = std_tr.clone();
					var tds = tem.find('td');

					tem.attr('tr_id', oo.tr_id);

					switch (oo.trType) {
					case "TITLELEVEL1": {
							tem.attr('istitle', 'istitle');
							tem.attr('level', '1');
							tds.css({
								'font-size' : "11pt",
								'font-weight' : "700"
							});
							break;
						}
					case "TITLELEVEL2": {
							tem.attr('istitle', 'istitle');
							tem.attr('level', '2');
							tds.css({
								'font-size' : "11pt",
								'font-weight' : "700"
							});
							break;
						}
					case "TITLELEVEL3": {
							tem.attr('istitle', 'istitle');
							tem.attr('level', '3');
							tds.css({
								'font-size' : "11pt",
								'font-weight' : "700"
							});
							break;
						}
					default: {
							break;
						}
					}
					tds.each(function (k) {
						$(this).text(oo.tr_data[k]);
					});
					$("#clearandreplacecontent").append(tem);
				}
			}
			//然后再调用文档生成
			selectTable(template_path);

		})
	}

	function createTableInnerMenu() {
		function findNearestItem(arr, idx) {
			console.log('arr:' + JSON.stringify(arr));
			console.log('arr-length:' + arr.length);
			let nnidx = 0;
			let nnDis = 1000000000;
			for (let i = 0; i < arr.length; i++) {
				let temDis = parseInt(idx) - parseInt(arr[i].tr_order);
				console.log('idx:' + idx + "---" + i + ":" + temDis);
				if (temDis > 0) {
					if (temDis < nnDis) {
						nnDis = temDis;
						nnidx = i;
					}
				}
			}
			console.log(nnidx);
			return arr[nnidx];
		}
		function getItem(item) {
			let prefix = "trClick";
			item.attr('id', prefix + item.attr('tr_order'));
			return {
				title : $.trim(item.text()),
				href : "#" + item.attr('id'),
				tr_order : $.trim(item.attr('tr_order')),
				level : $.trim(item.attr('level')),
				submenu : []
			};
		}
		let trsL1 = $('#clearandreplacecontent tr[istitle="istitle"][level="1"]');
		let trsL2 = $('#clearandreplacecontent tr[istitle="istitle"][level="2"]');
		let trsL3 = $('#clearandreplacecontent tr[istitle="istitle"][level="3"]');
		let tmenu = [];
		for (let i = 0; i < trsL1.length; i++) {
			tmenu.push(getItem(trsL1.eq(i)));
		}
		for (let i = 0; i < trsL2.length; i++) {
			let vv = findNearestItem(tmenu, trsL2.eq(i).attr('tr_order'));
			vv.submenu.push(getItem(trsL2.eq(i)));
		}
		for (let i = 0; i < trsL3.length; i++) {
			let vv = findNearestItem(tmenu, trsL3.eq(i).attr('tr_order'));
			let xx;
			if (vv.submenu.length != 0) {
				xx = findNearestItem(vv.submenu, trsL3.attr('tr_order'));
			} else {
				//没有二级的三级自动划分为二级
				trsL3.attr('level', "2");
				xx = findNearestItem(tmenu, trsL3.attr('tr_order'));
			}
			xx.submenu.push(getItem(trsL3.eq(i)));
		}
		return tmenu;
	}

	function renameExcel(excelId, newName) {
		$.ajax({
			type : "POST",
			url : SERVER_ROOT + "/excel/renameExcelById.action",
			data : {
				excelId : excelId,
				newName : newName
			},
			success : function (data) {
				$(".btn-list-select").trigger("click");
			},
			error : function () {
				console.log('cuowu');
			}
		});
	}
	if (!golbal.pp) {
		//初始化一个页面处理模块
		golbal.pp = new PagesModel("#clearandreplacecontent", 20, "col");
		golbal.spp = new PagesSPModel("#clearandreplacecontent", 20, "col");

	}
	//初始化布局
	init_layout(3.4, 15, -1);
	//添加table菜单


	$(window).resize(function () {
		init_layout(3.4, 15, -1);
	});
	//按钮绑定-------------------------------------------------------------------------

	//将表格的所有内容存储到数据库
	//需要确定接参数：表名，对应的记录id
	$(".float-bar").click(function () { //menu1
		var org_stat = $("#menu1").css("display");
		function pp(name, order) {
			return '<li layout="click" title="" href="#trClick0" tr_order="0" level="1">\
													<img src="./images/file2.png" style="-moz-box-sizing: border-box; \
													-webkit-box-sizing:border-box; border: 0; box-sizing: border-box; \
													vertical-align: middle;">\
													<span spanType="Catalog" catalogorder="' + order + '">' + name + '</span>\
													</li>';
		}
		function pp2() {
			let cc = ['封面', '目录', '编制说明', '1.1工程概况', '1.2承包范围',
				'2.1管理目标', '2.2节点计划', '3.1组织架构', '3.2人员配置', '3.3授权书',
				'4.1技术方案选择', '5.1分包选择方案', '5.2物资采购方案', '5.3机械配置方案',
				'5.4资源采购条件', '6.1现场临建方案', '6.2临水临电方案', '6.3监测设备配置方案',
				'6.4办公设备配置', '7.1总成本控制', '7.1-1管理费预算', '8.1现金流量预算', '8.1-1预算流入',
				'8.1-2.预算流出', '9.1文件编制计划'];
			let ret = '<ul style="padding-left:7px;">';
			for (let i in cc) {
				ret += pp(cc[i], i);
			}
			ret += '</ul>';
			return ret;
		}
		switch (golbal.BASEStatus.getExcelObj().excelType) {
		case "4": {
				$('#menu1').empty();
				$('#menu1').append(pp2());
				break;
			}
		default: {
				var menu = {
					title : "表格目录",
					id : "",
					submenu : []
				};
				let tmenu = createTableInnerMenu();

				menu.submenu = tmenu;
				$('#menu1').empty();
				updateJsonMenu(menu, $('#menu1'));

			}
		}

		if (org_stat == 'none') {
			$("#menu1").show();
			$("#menu2").hide();
		} else {
			$("#menu1").hide();
			$("#menu2").show();
		}
	});

	$("#save_tab").click(function () {
		//保存表格里面TableType='ctx'的行
		golbal.BASEFunction.saveTable();
		//tableSaveBase();

	});
	$("#hid_tar").click(function () {
		//关闭侧边栏
		init_layout(3.4, 0, -1);

	})
	$(".scale-option").change(function () {
		//控制缩放区域的
		if ($(this).val() != -1) {
			$('#clearandreplacecontent').css("zoom", $(this).val());
			golbal.pp.refreshPosition();
		} else {
			golbal.pp.selfAdaption();
			//golbal.pp.refreshPosition();
		}
	});
	//控制全屏
	$("#full_screen").click(function () {
		if ($('div[layout="2.1"]').is(":hidden") && $('div[layout="2.2"]').is(":hidden")) {
			stop_full_screen();
		} else {
			start_full_screen();
		}
	});
	$("#no_full_screen").click(stop_full_screen);

	//控制页面滚动的
	$("#scroll_down").click(function () {
		var length = 100;
		var obj = $('div[layout="2.3.2"]');
		var v = obj.scrollTop();
		obj.scrollTop(v + length);
	});
	$("#scroll_up").click(function () {
		var length = 100;
		var obj = $('div[layout="2.3.2"]');
		var v = obj.scrollTop();
		obj.scrollTop(v - length);

	});
	$(".btn-list").click(function () {
		//侧边栏按钮变色
		var t_id = this.id;
		$(".btn-list").each(function (i, e) {
			if (e.id != t_id) {
				$(e).removeClass("btn-list-select");
			} else {
				$(e).addClass("btn-list-select");
			}
		});
		var fun_btn = t_id;
		get_tab_trees(fun_btn, center, pro_id);
		init_layout(3.4, 15, -1);
	});

	$("#add_empty_tab").on("click", function () {
		//添加表单
		function createNewExcel(gong_cheng_id, excelType) {
			$.ajax({
				type : "GET",
				url : SERVER_ROOT + "/excel/createExcel.action",
				data : {
					'gong_cheng_id' : gong_cheng_id,
					'excelType' : excelType,
				},
				success : function (data) {
					console.log("CreateExcel-SUCCESS");
				},
				complete : function () {
					////刷新当前栏目的菜单
					$(".btn-list-select").trigger("click");
				},
				error : function () {
					console.log('创建表单失败');
				}
			});
		}
		createNewExcel(1, $("li[click_select=true][emptyfile!=true]").attr("excelType"));
		////刷新当前栏目的菜单
		$(".btn-list-select").trigger("click");
	});
	$("#del_tab").on("click", function () {
		//删除表单
		function deleteExcel(excel_id) {
			$.ajax({
				type : "GET",
				url : SERVER_ROOT + "/excel/deleteExcel.action",
				data : {
					'excel_id' : excel_id,
				},
				success : function (data) {
					console.log("deleteExcel-SUCCESS");
				},
				complete : function () {
					////刷新当前栏目的菜单
					$(".btn-list-select").trigger("click");
				},
				error : function () {
					console.log('删除表单失败');
				}
			});
		}

		deleteExcel($("li[click_select=true][emptyfile!=true]").attr("excel_id"));
		//////////////////////
		////刷新当前栏目的菜单
		$(".btn-list-select").trigger("click");

	});
	$("#copy_tab").on("click", function () {
		//复制表单
		function copyExcel(excel_id) {
			$.ajax({
				type : "GET",
				url : SERVER_ROOT + "/excel/copyExcel.action",
				data : {
					'excel_id' : excel_id
				},
				success : function (data) {
					console.log("CopyExcel-SUCCESS");
				},
				complete : function () {
					////刷新当前栏目的菜单
					$(".btn-list-select").trigger("click");
				},
				error : function () {
					console.log('创建表单失败');
				}
			});
		}
		copyExcel($("li[click_select=true][emptyfile!=true]").attr("excel_id"));

		////刷新当前栏目的菜单
		$(".btn-list-select").trigger("click");

	});
	$("#rename_tab").on("click", function () {
		//重命名表单
		//刷新当前栏目的菜单
		//li[click_select=true]
		let onSelected = $("li[click_select=true][emptyfile!=true]");
		$.confirm({
			title : '表单重命名',
			content : '<input type="text" class="tele form-control" value="' + onSelected.text() + '" placeholder="请输入表单名称">',
			buttons : {
				formSubmit : {
					text : '确定',
					action : function () {
						var tele = $.trim(this.$content.find('.tele').val());
						if (tele.length == 0) {
							$.alert('表单名称不得为空！');
							return false;
						}
						renameExcel($.trim(onSelected.attr('excel_id')), tele);
					}

				},
				cancel : {
					text : '取消',
					action : function () {
						//$.alert('Canceled!')
					}
				}
			}
		});
		$(".btn-list-select").trigger("click");

	});

	(function () {
		const clipboard = require('electron').clipboard;
		function unselect_tr() {
			$(document).trigger("keydown");
			$(".on-tr-handle-select").removeClass("on-tr-handle-select");
			$(".on-tr-handle-select-td").removeClass("on-tr-handle-select-td");
			$('#handle_tr').hide();
		}
		$('body').on('click', 'div[layout="margin"]', function () {
			//margin的双击变化
			if (golbal.pp.margin > 10) {
				golbal.pp.margin = 6;
				golbal.pp.hideHeadFoot();
			} else {
				golbal.pp.margin = 20;
				golbal.pp.restortHeadFoot();
			}
		});

		$('body').on('mousedown', 'td', function (e) {
			//表格处理菜单的触发
			if (3 == e.which) {
				unselect_tr();
				var xx = e.originalEvent.x || e.originalEvent.layerX || 0;
				var yy = e.originalEvent.y || e.originalEvent.layerY || 0;

				if (window.innerWidth - xx < 200) {
					xx = xx - 190;
				}
				if (window.innerHeight - yy < 300) {
					yy = yy - 285;
				}

				$('#handle_tr').css({
					"position" : 'fixed',
					"left" : xx,
					"top" : yy - 3
				});
				$('#handle_tr').show();
				$(this).parent().addClass("on-tr-handle-select");
				$(this).addClass("on-tr-handle-select-td");
			} else {
				unselect_tr()
			}
		});
		$('body').on('click', '#add_new_tr', function (e) {
			//表格添加新的一行
			var nobj = $(".on-tr-handle-select");
			if (nobj.attr('TableType') == 'ctx') {
				var temtr = $(".on-tr-handle-select").clone(true);
				temtr.attr("tr_id", ""); //清空行的唯一编号
				temtr.find("td").each(function () {
					$(this).empty();
				});
				nobj.after(temtr);
			}
			unselect_tr()
		});
		$('body').on('click', '#delect_select_tr', function (e) {
			//表格删除当前行
			var nobj = $(".on-tr-handle-select");
			if (nobj.attr('TableType') == 'ctx') {
				if (nobj.attr('tr_id') != '') {
					var istitleflag = nobj.attr('istitle');

					$.ajax({
						type : "GET",
						url : SERVER_ROOT + "/excel/deleteTr.action",
						data : {
							'tableType' : golbal.BASEStatus.getTableObj().tableType,
							'id' : nobj.attr('tr_id'),
							'istitle' : istitleflag
						},
						success : function (data) {
							nobj.remove();
						},
						error : function () {
							console.log('cuowu');
						}
					});
				} else {
					nobj.remove();
				}
			}
			unselect_tr();
		});
		$('body').on('click', '#copy_select_tr', function (e) {
			//表格复制当前行
			var nobj = $(".on-tr-handle-select");
			if (nobj.attr('TableType') == 'ctx') {
				var temtr = nobj.clone(true);
				temtr.attr("tr_id", ""); //清空行的唯一编号
				nobj.after(temtr);
			}
			unselect_tr()
		});

		$('body').on('click', '#jianqieTd', function (e) {
			let cc = $.trim($(".on-tr-handle-select-td").text());
			clipboard.writeText(cc);
			$(".on-tr-handle-select-td").empty();
			unselect_tr();

		});
		$('body').on('click', '#fuzhiTd', function (e) {
			let cc = $.trim($(".on-tr-handle-select-td").text());
			clipboard.writeText(cc);
			unselect_tr();

		});
		$('body').on('click', '#zhantieTd', function (e) {
			let cc = $.trim(clipboard.readText());
			$(".on-tr-handle-select-td").text(cc);
			unselect_tr();
		});
		$('body').on('click', '#emptyTd', function (e) {
			$(".on-tr-handle-select-td").empty();
			unselect_tr();
		});

		$('body').on('click', '.set_as_title', function (e) {
			var nobj = $(".on-tr-handle-select");
			if ($(".on-tr-handle-select").attr('TableType') == 'ctx') {
				//设置当前行为标题

				var temtr = nobj.clone(true);
				
				///这里复制可能是有问题的，要不要考虑去掉属性
				var tds = temtr.find('td');
				//清空行的唯一编号
				temtr.attr("tr_id", "");
				//标题编号设置为true
				temtr.attr("istitle", 'istitle');
				temtr.attr("level", $(this).attr("level"));
				tds.css({
					'font-size' : "11pt",
					'font-weight' : "700"
				});

				if ($(this).attr("level") == "1") {
					temtr.css("background-color", "#FFB5C5");
				}
				if ($(this).attr("level") == "2") {

					temtr.css("background-color", "#A4D3EE");
				}
				if ($(this).attr("level") == "3") {

					temtr.css("background-color", "#98FB98");
				}

				nobj.after(temtr);

			}
			unselect_tr();
		});
		$('body').on('keyup', '.forEdit', function () {
			golbal.pp.changeEditDOM($(this).attr('label'), $(this).text());
		});

	})();

	//按钮绑定-------------------------------------------------------------------------


	$(document).bind("contextmenu", function (e) {
		return false;
	});

	$(".new-button").click(function () {
		var tar_id = this.id;
		$(".new-button").each(function (i, e) {
			if (tar_id == e.id) {
				$(this).css({
					"border-bottom" : "3px solid #000",
					"color" : "#000"
				});
			} else {
				$(this).css({
					"border-bottom" : "3px",
					"color" : "#a5a5a5"
				});
			}
		});
	});

	//!///////////////////////////////////////
	//!左侧菜单操作
	$('body').on('click', '#table_nav li', function () {
		//点击表内菜单完成切换页面
		//这里添加当前操作的Table的id号####非常重要
		/*
		if (typeof($(this).attr('table_id')) == "undefined") {
		alert("这个表格有BUG");
		}
		 */
		$(this).parent().find('li').css({
			'background-color' : '#ddd',
			'color' : '#000',
			'border-bottom' : '0px solid #797979'
		}).removeAttr('nowHandleTable');
		$(this).css({
			'background-color' : '#fff',
			'color' : '#217346',
			'border-bottom' : '3px solid #797979'
		}).attr('nowHandleTable', 'nowHandleTable');
		golbal.BASEStatus.switchTable(
			$(this).attr('table_id'),
			$(this).attr('tabletype'));
		loadTablePage($(this).attr('template_tab'));
	});

	$("body").on('click', 'div[layout="2.2"] li[layout="click"]', function (evt) {

		//这是判断是不是点击了空白表，如果是就新建一个空白的表
		let template_tab = getTemplateByExcelType($(this).attr('excelType'));
		template_tab = eval(template_tab);

		if ($(this).attr("emptyFile") == 'true') {

			//切换Excel
			golbal.BASEStatus.switchExcel("", $(this).attr("excelType"));
			updateEmptyFileTableList(template_tab, function () {
				$('#table_nav li').eq(0).trigger('click');
			});

		} else {

			golbal.BASEStatus.switchExcel($(this).attr("excel_id"), $(this).attr("excelType"));

			updateTableList(template_tab, function () {
				$('#table_nav li').eq(0).trigger('click');
			});
			//这里可以加入复制表单
		}

	});
	function updateEmptyFileTableList(table_list, func) {
		//更新table菜单的表
		//去掉打印菜单就没有了why？？、
		//console.log('table_list:' + JSON.stringify(table_list));
		let excelType = golbal.BASEStatus.getExcelObj().excelType;
		function createInnerTableMenu() {
			if (!table_list.length)
				return;
			var ul = $('#table_nav ul');
			ul.empty();
			for (var i in table_list) {
				var ll = $('<li style="border-radius: 13px 0px 0px 0px;margin-right:-10px;padding-right:14px"></li>');
				ll.append(table_list[i].name);
				ll.attr('template_tab', table_list[i].template);
				ll.attr('tableType', table_list[i].tableType);
				ll.attr('excelType', excelType);
				ul.append(ll);
			}

		}
		createInnerTableMenu();
		func();

	}
	function updateTableList(table_list, func) {
		let excel_id = golbal.BASEStatus.getExcelObj().excelId;
		let excelType = golbal.BASEStatus.getExcelObj().excelType;
		//更新table菜单的表
		//去掉打印菜单就没有了why？？、
		//console.log('table_list:'+JSON.stringify(table_list));
		function createInnerTableMenu(resolve, reject) {
			if (!table_list.length)
				return;
			var ul = $('#table_nav ul');
			ul.empty();
			for (var i in table_list) {
				var ll = $('<li style="border-radius: 13px 0px 0px 0px;margin-right:-10px;padding-right:14px"></li>');
				ll.append(table_list[i].name);
				ll.attr('template_tab', table_list[i].template);
				ll.attr('tableType', table_list[i].tableType);
				ll.attr('excelType', excelType);
				ll.attr('excel_id', excel_id);
				ul.append(ll);
			}
			resolve("");
		}
		function getNowExcelTableId(resolve, reject) {
			$.ajax({
				type : "GET",
				url : SERVER_ROOT + "/excel/getTableIdList.action?excel_id=" + excel_id,
				success : function (data) {
					resolve(data);
				},
				error : function () {
					console.log('cuowu');
				}
			});
		}

		//获取当前Excel下的Table的id
		var a = new Promise(getNowExcelTableId);
		//加载表格数据
		var b = new Promise(createInnerTableMenu);
		var p = Promise.all([a, b]);
		//并发处理
		p.then(function (val) {
			//加入表格id
			var data = eval(val[0]);
			$('#table_nav ul li').each(function () {
				var type = $(this).attr('tableType');
				for (var k = 0; k < data.length; k++) {
					if (data[k].tableType == type) {
						$(this).attr('table_id', data[k].table_id);
						break;
					}
				}
			});
			func();
		});
	}
	//!///////////////////////////////////////
	//!表内菜单操作
	$('body').on("click", '#menu1 li span', function (event) {
		//表格内部菜单的定位功能
		switch ($(this).attr('spanType')) {
		case 'Catalog': {
				$('#table_nav li').eq($(this).attr('catalogorder')).trigger('click');
				break;
			}
		case 'Item': {
				var obj = $('div[layout="2.3.2"]');
				let tr_order = $(this).parent().attr('tr_order');
				let realTr = $('#clearandreplacecontent').find('tr[tr_order="' + tr_order + '"]');
				obj.scrollTop(obj.scrollTop() + realTr.offset().top - 100);
				break;
			}
		}
		event.stopPropagation();
	});
	//!///////////////////////////////////////
	//!右击选择菜单操作
	$('body').on('mousedown', 'li[layout=click][emptyfile!=true]', function (e) {
		//展开右击选择菜单
		if (3 == e.which) {
			var xx = e.originalEvent.x || e.originalEvent.layerX || 0;
			var yy = e.originalEvent.y || e.originalEvent.layerY || 0;
			if (window.innerWidth - xx < 200) {
				xx = xx - 190;
			}
			if (window.innerHeight - yy < 140) {
				yy = yy - 133;
			}

			$('#youjicaidan').css({
				"position" : 'fixed',
				"left" : xx,
				"top" : yy - 3
			});
			$('#youjicaidan').show();
			$(this).attr("click_select", "true");
		}
	})
	$("body").click(function () {
		//取消右击菜单
		$('#youjicaidan').hide();
		$("li[click_select=true][emptyfile!=true]").attr("click_select", "false");
	});
})
