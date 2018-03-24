/*
$(function () {


// OK:1.每一个tr加入到cur——table，
// 每次加入cur-table，判断是否满，满了还下一个table

// OK:2.梳理时遍历table列表，每个表超出的部分加到下一个table，
// 最终多出来的新建table

// 3.断表，截断与续接要求表有名字


var pp = new PagesModel("body", 100, "row");
pp.run();
pp.setPosition(0, 0);

})
 */
class PagesModel {
	constructor(obj, margin, model) {
		this.arr_pages = new Array();
		this.obj = $(obj);
		this.margin = margin;
		this.default_margin = margin;
		this.org_margin = margin;
		this.wp = 0;
		this.hp = 0;
		this.tw = 0;
		//标准行高
		this.StdTrHeight = 36;
		//页头的高度
		this.top_margin = 50;
		//页尾的高度
		this.buttom_margin = 50;
		//表头高度
		this.table_head_height = 0;
		this.page_table_head_ctx;
		//表尾高度
		this.table_foot_height = 0;
		this.page_table_foot_ctx;
		this.ctx_padding = (this.wp - this.tw) / 2;
		//表格限制的最大
		this.head_ctx = '';
		this.foot_ctx = '';
		this.tr_head = '';
		this.limit = 0;
		this.initJQBinding();
	}
	run(model) {
		this.margin = this.default_margin;
		this.stdTr=golbal.BASEStatus.stdTr.clone();
		this.StdTrHeight=golbal.BASEStatus.stdTrHeight;
		if (model.length != 0) {
			//单位换算的网站，windows标准DPI为96
			//http://www.gaitubao.com/tools/pixel2cm.html
			//
			if (model == "row") {
				this.wp = 1122; //297mm
				this.hp = 793; //210mm
				this.tw = 974; //标准表格宽度取自153表
				this.top_margin = 44; //11.9mm
				// this.buttom_margin=48;	//12.9mm
				this.buttom_margin = 74; //19.8mm
				this.ctx_padding = 74; //19.8mm
				this.table_head_height = 81;
				//这里设置0 更好看、理论上应该是27，字体大小应该是14
				this.table_foot_height = 14;

			} else {

				this.wp = 793; //210mm
				this.hp = 1122; //297mm
				this.tw = 645; //
				this.top_margin = 33; //8.9mm
				//this.buttom_margin=44;	//11.9mm
				this.buttom_margin = 74; //19.8mm
				this.ctx_padding = 74; //19.8mm
				this.table_head_height = 81;
				//这里设置0 更好看、理论上应该是27，字体大小应该是14
				this.table_foot_height = 14;
			}
		} {
			var jq_obj = this.obj.find("table[TableType='head']");
			this.tr_head = jq_obj.html();
			var tem_hh = 0;
			var jq_obj_tr = jq_obj.find('tr');
			for (var i = 0; i < jq_obj_tr.length; i++) {
				tem_hh += $(jq_obj_tr[i]).height();
			}
			jq_obj.remove();
			this.tr_head_height = tem_hh;
		}{

			this.limit = (this.hp - this.top_margin - this.buttom_margin - this.table_foot_height - this.table_head_height - this.tr_head_height);
		}
		//this.tr_head=tr_head_obj.html;
		//this.tr_head_height=tr_head_obj.height;

		//启动前初始化
		this.formatTrHeight();
		this.empty();
		//
		this.handleTrToTable();
		this.addPageToLayout();
		this.initEidt();
		this.listenTableChange();
		//启动时做一次自我调整
		//保证内存和渲染的 内容一致
		this.onTableChange();
		//表格的美观的obj容器缩放
		this.selfAdaption();
		//这里把所有的特殊标记的DOM，加入到arr_pages里面
		this.handleEditDOM();

		this.handlePageWithEmptyTr();
	}
	handleEditDOM() {
		//将特殊标记的DOM加入到arr_pages
		for (var i = 0; i < this.arr_pages.length; i++) {
			var oo = this.arr_pages[i].page.find('.forEdit');
			for (var k = 0; k < oo.length; k++) {
				oo[k] = $(oo[k]);
				if (oo[k].attr('label')) {
					var vv = this.obj.find("input[iidata='" + oo[k].attr('label') + "']");
					oo[k].text(vv.val());

					vv.remove();
					this.arr_pages[i][oo[k].attr('label')] = oo[k];
				}
			}
		}
	}
	changeEditDOM(label, content) {
		//将所有的editDOM赋值
		for (var i = 0; i < this.arr_pages.length; i++) {
			if (this.arr_pages[i][label].text() != content) {
				this.arr_pages[i][label].text(content);

			}
		}
	}
	empty() {
		//清空表格
		this.arr_pages = [];
		//this.obj.empty();
	}
	setTableHead(ctx) {
		//设置表头标题
		this.page_table_head_ctx = ctx;
	}
	setTableFoot(ctx) {
		//设置表头标题
		this.page_table_foot_ctx = ctx;
	}
	setPosition(top, left) {
		//设置头一个页面的位置然后刷新所有的页面
		this.arr_pages[0].page.css({
			"top" : top,
			"left" : left,
		});
		this.arr_pages[0].margin.css({
			"top" : top + this.hp,
			"left" : left,
		});
		this.refreshPosition();

	}
	refreshPosition() {
		//全屏后刷新位置
		this.arr_pages[0].page.css({
			"left" : ((this.obj.width() - this.wp) / 2) + 'px'
		});
		this.arr_pages[0].margin.css({
			"left" : ((this.obj.width() - this.wp) / 2) + 'px',
		});
		this.setMargin();
	}
	selfAdaption() {
		//自适应缩放
		var mar = 40;
		//这里用layout——2.3的宽度主要
		//是obj的宽度会被缩放变化
		var p_width = $('div[layout="2.3"]').width();
		var bestwidth = (p_width - (mar * 2));
		var ratio = bestwidth / this.wp;
		this.obj.css("zoom", ratio);
		//缩放后重新刷新布局
		this.refreshPosition();
	}
	setMargin() {
		//序列化表格位置并且设置margin
		for (var i = 1; i < this.arr_pages.length; i++) {
			var top_num = parseInt(this.arr_pages[i - 1].page.css("top"))
				 + parseInt(this.arr_pages[i - 1].page.css("height")) + this.margin;
			this.arr_pages[i].page.css({
				"width" : this.arr_pages[i - 1].page.css("width"),
				"left" : this.arr_pages[i - 1].page.css("left"),
				"top" : (top_num) + 'px',
			});
			this.arr_pages[i].margin.css({
				"width" : this.arr_pages[i - 1].page.css("width"),
				"height" : this.margin + "px",
				"left" : this.arr_pages[i - 1].page.css("left"),
				"top" : (top_num + this.arr_pages[i].page.height()) + 'px',
			});
		}
		this.arr_pages[0].margin.css({
			"width" : this.arr_pages[0].page.css("width"),
			"height" : this.margin + "px",
			"left" : this.arr_pages[0].page.css("left"),
			"top" : (parseInt(this.arr_pages[0].page.css("top")) + this.arr_pages[0].page.height()) + 'px',
		});
	}
	formatTrHeight() {
		$("tr[TableType='ctx']").height(this.StdTrHeight);
		$("tr[TableType='ctx'] td").css({
			'height' : this.StdTrHeight,
			'margin' : 0,
		});
	}
	createTable() {
		var table = $('<table  border="3" cellpadding="0" \
																						cellspacing="0" style="border-top:none;border-collapse:\
																						collapse;table-layout:fixed;margin-bottom:3px;">');
		//这个地方可能有问题，先注释一下
		table.width(this.tw);
		//table.append(this.tr_head);
		return table;
	}
	hideHeadFoot() {
		//折叠页眉页脚，表头表脚
		console.log("hideHeadFoot"); {
			this.arr_pages[0].page_foot.hide();
			this.arr_pages[0].page_foot.height(0);
			this.arr_pages[0].page_table_foot.hide();
			this.arr_pages[0].page_table_foot_real_ctx.hide();
			this.arr_pages[0].page_table_foot.height(0);
			var tem = parseInt(this.arr_pages[0].table.height()) + 13; //+8
			this.arr_pages[0].page_ctx.css({
				"height" : tem,
				"padding-bottom" : "5px",
			});
			this.arr_pages[0].page.height(tem + this.top_margin + this.table_head_height);
		}
		for (var i = 1; i < this.arr_pages.length - 1; i++) {
			this.arr_pages[i].page_head.hide();
			this.arr_pages[i].page_head.height(0);
			this.arr_pages[i].page_table_head.hide();
			this.arr_pages[i].page_table_head.height(100);
			this.arr_pages[i].head_table.hide();
			this.arr_pages[i].page_table_foot.hide();
			this.arr_pages[i].page_table_foot.height(0);
			this.arr_pages[i].page_table_foot_real_ctx.hide();
			this.arr_pages[i].page_foot.hide();
			this.arr_pages[i].page_foot.height(0);
			tem = parseInt(this.arr_pages[i].table.height()) + 17; //5+5+8
			this.arr_pages[i].page_ctx.css({
				"height" : tem,
				"padding-top" : "5px",
				"padding-bottom" : "5px",
			});
			this.arr_pages[i].page.height(tem);
			this.arr_pages[i].page_ctx.css("top", 0);
		}

		//最后一个页面保留尾巴
		{
			this.arr_pages[i].page_head.hide();
			this.arr_pages[i].page_head.height(0);
			this.arr_pages[i].page_table_head.hide();
			this.arr_pages[i].page_table_head.height(0);

			this.arr_pages[i].head_table.hide();
			var tem = parseInt(this.arr_pages[i].table.height()) + 5;
			this.arr_pages[i].page_ctx.css({
				"height" : tem,
				"padding-top" : "5px",
			});
			this.arr_pages[i].page.height(tem + this.table_foot_height + this.buttom_margin);
			this.arr_pages[i].page_ctx.css("top", 0);
			this.arr_pages[i].page_table_foot.css("top", tem);
			this.arr_pages[i].page_foot.css("top", (tem + this.table_foot_height));
		}
		this.setMargin();
	}
	restortHeadFoot() {
		//恢复页眉页脚，表头表脚

		var ctx_height = (this.hp - this.top_margin - this.buttom_margin - this.table_foot_height - this.table_head_height);
		for (var i = 0; i < this.arr_pages.length - 1; i++) {
			this.arr_pages[i].page_head.show();
			this.arr_pages[i].page_head.height(this.top_margin);
			this.arr_pages[i].page_table_head.show();
			this.arr_pages[i].page_table_head.height(this.table_head_height);
			this.arr_pages[i].head_table.show();
			this.arr_pages[i].page_table_foot.show();
			this.arr_pages[i].page_table_foot.height(this.table_foot_height);
			this.arr_pages[i].page_table_foot_real_ctx.show();

			this.arr_pages[i].page_foot.show();
			this.arr_pages[i].page_foot.height(this.buttom_margin);

			this.arr_pages[i].page_ctx.css({
				"height" : ctx_height + "px",
				"padding-top" : "0px",
				"padding-bottom" : "0px",
			});
			this.arr_pages[i].page.height(this.hp);
			this.arr_pages[i].page_ctx.css("top", this.top_margin + this.table_head_height);
		} {
			this.arr_pages[i].page_head.show();
			this.arr_pages[i].page_head.height(this.top_margin);
			this.arr_pages[i].page_table_head.show();
			this.arr_pages[i].page_table_head.height(this.table_head_height);

			this.arr_pages[i].head_table.show();

			this.arr_pages[i].page_table_foot.show();
			this.arr_pages[i].page_table_foot.height(this.table_foot_height);

			this.arr_pages[i].page_table_foot_real_ctx.show();
			this.arr_pages[i].page_foot.show();
			this.arr_pages[i].page_foot.height(this.buttom_margin);

			this.arr_pages[i].page_ctx.css({
				"height" : ctx_height + "px",
				"padding-top" : "0px",
				"padding-bottom" : "0px",
			});
			this.arr_pages[i].page.height(this.hp);
			this.arr_pages[i].page_ctx.css("top", this.top_margin + this.table_head_height);
			this.arr_pages[i].page_table_foot.css("top", this.top_margin + this.table_head_height + ctx_height);
			this.arr_pages[i].page_foot.css("top", this.top_margin + this.table_head_height + ctx_height + this.table_foot_height);
		}
		this.setMargin();
	}
	createA4page() {
		//标准A4
		var page_head = $('<div layout="head"></div>');
		var page_foot = $('<div layout="foot"></div>');
		var page_table_head = $('<div  layout="table_head"></div>');
		var page_table_foot = $('<div  layout="table_foot"></div>');
		var page_table_foot_real_ctx = $('<div layout="table_foot_ctx"></div>');
		var page_ctx = $('<div  layout="ctx"></div>');
		var page = $('<div  layout="page"></div>');
		//这里是页眉的添加
		//$(page_head).append(this.head_ctx);
		$(page_foot).append(this.foot_ctx);

		page.append($(page_head));
		page.append($(page_table_head));
		page.append($(page_ctx));
		page.append($(page_table_foot));
		page.append($(page_foot));

		var top_offset = 0;
		page_head.css({
			"position" : "absolute",
			"top" : top_offset,
			"height" : this.top_margin,
			"width" : "100%",
			"padding-left" : this.ctx_padding + "px",
			"padding-right" : this.ctx_padding + "px",
			"background-color" : "#fff",
			"z-index" : 0

		});
		top_offset += this.top_margin;
		page_table_head.css({
			"position" : "absolute",
			"top" : top_offset + "px",
			"height" : this.table_head_height + "px",
			"width" : "100%",
			"padding-left" : this.ctx_padding + "px",
			"padding-right" : this.ctx_padding + "px",
			"background-color" : "#fff",
			"z-index" : 0
		});
		top_offset += this.table_head_height;
		page_ctx.css({
			"top" : top_offset + "px",
			"position" : "absolute",
			"height" : (this.hp - this.top_margin - this.buttom_margin - this.table_foot_height - this.table_head_height) + "px",
			"width" : (this.wp) + "px",
			"padding-left" : this.ctx_padding + "px",
			"padding-right" : this.ctx_padding + "px",
			"background-color" : "#fff",
			"z-index" : 1
		});
		top_offset += (this.hp - this.top_margin - this.buttom_margin - this.table_foot_height - this.table_head_height);
		page_table_foot.css({
			"position" : "absolute",
			"top" : top_offset + "px",
			"height" : this.table_foot_height + "px",
			"width" : "100%",
			"padding-left" : this.ctx_padding + "px",
			"padding-right" : this.ctx_padding + "px",
			"background-color" : "#fff",
			"z-index" : 0
		});
		top_offset += this.table_foot_height;
		page_foot.css({
			"top" : top_offset + "px",
			"position" : "absolute",
			"height" : this.buttom_margin + "px",
			"width" : "100%",
			"padding-left" : this.ctx_padding + "px",
			"padding-right" : this.ctx_padding + "px",
			"background-color" : "#fff",
			"z-index" : 0
		});
		page.css({
			"position" : "absolute",
			"height" : this.hp + 'px',
			"width" : this.wp + 'px',
			"background-color" : "#fff"
		});
		/*
		this.obj.css({
		"padding-bottom":"1000px"
		});
		 */

		var tab = this.createTable();
		//这里可以添加表格的表头

		page_table_head.append(this.page_table_head_ctx);
		//page_table_foot.append(this.page_table_foot_ctx);
		page_table_foot_real_ctx.append(this.page_table_foot_ctx);

		var tab2 = $('<table  border="3" cellpadding="0" \
																					width="' + this.tw + '" cellspacing="0" \
																					style="border-bottom:none;\
																					border-collapse:collapse;table-layout:fixed;">');
		tab2.append(this.tr_head);
		tab2.find('td').each(function () {
			$(this).attr("ed", "false");
		});
		page_ctx.append($("<center></center>").append(tab2).append($(tab)));
		//表尾巴的占位和内容分离
		page_ctx.append(page_table_foot_real_ctx);

		//这里添加margin的div
		var margin_div = $('<div layout="margin" style="cursor:s-resize;"></div>');
		margin_div.css({
			"position" : "absolute",
			"width" : this.wp + 'px',
			"height" : this.margin,
			"margin" : 0,
			"padding" : 0,
		});
		this.arr_pages.push({
			"page" : page,
			"page_head" : page_head,
			"page_table_head" : page_table_head,
			"page_ctx" : page_ctx,
			"page_table_foot" : page_table_foot,
			"page_table_foot_real_ctx" : page_table_foot_real_ctx,
			"page_foot" : page_foot,
			"margin" : margin_div,
			"head_table" : tab2,
			"table" : tab,
		});
		return page;
	}

	handleTrToTable() {
		//把一个行的列表添加到页面
		this.updateTrGroup();
		var pthis = this;
		$("tr[TableType='ctx']").each(function () {
			var id = $(this).attr('groupid');
			if (id < pthis.arr_pages.length) {
				pthis.arr_pages[id].table.append($(this));
			} else {
				pthis.createA4page();
				pthis.arr_pages[id].table.append($(this));
			}
		});
	}
	updateTrGroup() {
		//更新tr分组

		var mar = 0; //安全距离
		var limit = (this.limit - mar);
		//初始化高度应该为表头的高度
		var sum = 0;
		var gid = 0;
		var pthis = this;

		var sstr = $("tr[TableType='ctx']");
		for (var i = 0; i < sstr.length; i++) {
			if ((sum + sstr.eq(i).height()) > limit) {
				gid++;
				sum = 0;
			}
			sum += sstr.eq(i).height();
			sstr.eq(i).attr('groupid', gid);
			sstr.eq(i).attr('tr_order', i);
		}

	}

	addPageToLayout() {
		//这个可以用于把新添加的页面加到obj里面
		//把page队列加到框架页面里面去
		var page_num = this.obj.find('div[layout="page"]').length;
		for (var i = page_num; i < this.arr_pages.length; i++) {
			//把所有的表加到布局里
			this.obj.append(this.arr_pages[i].page);
			this.obj.append(this.arr_pages[i].margin);
		}
		this.refreshPosition()
		//refreshPosition里面已经调用了一次
		//这里是不是可以不用调用了
		//this.setMargin();
	}
	initEidt() {
		//初始化表格编辑的功能，并且给行编号
		$("td").each(function () {
			/*
			这里是有内容的都不可以编辑
			var temcc = $(this).text();
			temcc = $.trim(temcc)
			if (temcc.length != 0) {
			$(this).attr("ed", "false");
			//禁止选中
			$(this).attr("onselectstart", 'return false');
			}
			 */
			if ($(this).attr("ed") == "false") {
				$(this).attr("onselectstart", 'return false');
			}
		});

		$("td[ed!=false]").click(function () {
			$(this).attr("contentEditable", "true");
		});

		//为每一行编号
		$("tr").each(function (i) {
			$(this).attr("idx", i);
		});

	}
	checkTableExist(idx) {
		//判断table index是否合法
		//不合法就新建一个或者打印
		//异常
		if (idx < this.arr_pages.length) {
			return true;
		} else {
			if (idx == this.arr_pages.length) {
				this.createA4page();
			} else {
				console.log('Table index error!');
			}
		}
	}
	insertTrTotable(tbl_idx, tr) {
		//强制在table前面插入一行
		this.checkTableExist(tbl_idx);
		var trs = this.arr_pages[tbl_idx].table;
		trs.prepend(tr);
	}
	onTableChange() {
		//检查每个table的大小
		this.updateTrGroup();
		for (var i = 0; i < this.arr_pages.length; i++) {
			var trs = this.arr_pages[i].table.find("tr[TableType='ctx']");
			//向下插入
			for (var k = trs.length - 1; k >= 0; k--) {
				var gid = trs.eq(k).attr("groupid");
				if (gid == i) {
					break;
				} else {
					this.insertTrTotable(i + 1, trs.eq(k));
				}
			}
			//向上收缩

			for (var k = 0; k < trs.length; k++) {
				var gid = trs.eq(k).attr("groupid");
				if (gid == i) {
					break;
				} else {
					this.arr_pages[i - 1].table.append(trs.eq(k));
					//判断当前页面是否为空
					this.handleEmptyPage();
				}
			}
		}
		this.setMargin();
		//为了保险再处理一次
		this.handleEmptyPage();
	}

	listenTableChange() {
		var pthis = this;

		var limit = (this.limit);
		$(document).keydown(function (event) {
			for (var i = 0; i < pthis.arr_pages.length; i++) {
				var tt = pthis.arr_pages[i].table;
				//console.log(tt.height());
				//console.log(limit);
				if ((tt.height() > limit) || (tt.height() < limit - 30)) {
					pthis.onTableChange();
					pthis.addPageToLayout(pthis.obj);
					pthis.handlePageWithEmptyTr();
					break;
				}
			}

		});
	}
	handleEmptyPage() {
		//处理完全空白的页面
		var idx = this.arr_pages.length - 1;
		var tr_num = this.arr_pages[idx].table.find('tr').length;
		if (tr_num == 0) {
			this.arr_pages[idx].page.remove(); ;
			this.arr_pages.pop();
		}
	}
	handleRemovePageWithEmptyTr() {
		//判断是否是没有填写的页面，占时没有使用
		var pthis = this;
		function IsUsedPage(pagesItem) {
			var tr_num = pagesItem.table.find('td');
			var isEmpty = 0;
			for (var i = 0; i < tr_num.length; i++) {
				if ($.trim(tr_num.eq(i).text()).length != 0) {
					isEmpty = 1;
					break;
				}
			}
			if (isEmpty == 1) {
				return true;
			} else {
				return false;
			}
		}

		var idx = this.arr_pages.length - 1;
		if (idx > 0) {
			if (!IsUsedPage(this.arr_pages[idx])) {
				if (!IsUsedPage(this.arr_pages[idx - 1])) {
					this.arr_pages[idx].page.remove(); ;
					this.arr_pages.pop();
				}
			}
		}
	}
	handlePageWithEmptyTr() {

		this.handleRemovePageWithEmptyTr();
		//补充表格到满
		var limit = (this.limit);
		var idx = this.arr_pages.length - 1;
		var trs = this.arr_pages[idx].table.find('tr');
		var sum = 0;
		for (var i = 0; i < trs.length; i++) {
			sum += trs.eq(i).height();
		}
		//默认一行高度是36
		var lastNum = parseInt((limit - sum) /this.StdTrHeight);
		console.log(lastNum); {
			var stdTr = this.stdTr.clone();
			stdTr.height(this.StdTrHeight);
			stdTr.removeAttr('tr_id');
			stdTr.removeAttr('trType');
			stdTr.removeAttr('istitle');
			stdTr.removeAttr('level');
			stdTr.find('td').css({
				'font-size' : '13.31px',
				'font-weight' : '400'
			});
			stdTr.find('td').height(this.StdTrHeight).each(function(){
				if($(this).attr('ed')!="false"){
					$(this).attr("contentEditable", "true");
				}
			});
			
		}
		for (var i = 0; i < lastNum; i++) {
			this.arr_pages[idx].table.append(stdTr.clone());
		}
		this.updateTrGroup();
	}
	initJQBinding() {
		$('body').on('click', 'td[gttable="gttable"]', function () {
			$(this).css({
				'padding-right' : 0,
				'padding-left' : 0
			})
			if ($.trim($(this).html()).length == 0) {
				$(this).append("<div style='background-color:black;height:30%;width:100%'></div>");
			} else {
				$(this).empty();
			}
		});
	}
}
