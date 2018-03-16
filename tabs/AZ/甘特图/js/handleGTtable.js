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
class PagesSPModel {
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
	}
	run(model) {
		console.log("asasdsad");
		this.margin = this.default_margin;
		if (model.length != 0) {
			//单位换算的网站，windows标准DPI为96
			//http://www.gaitubao.com/tools/pixel2cm.html
			//
			if (model == "row") {
				this.wp = 1122; //297mm
				this.hp = 793; //210mm
				this.tw = 974; //标准表格宽度取自153表
				this.top_margin = 44; //11.9mm
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
		}

		this.assemble();

	}
	assemble() {
		//let cc = this.obj.html();
		let cc = this.obj.find("table[TableType='spctx']");

		console.log(cc);
		var page = $('<div  layout="page"></div>');
		page.css({
			"position" : "absolute",
			"height" : this.hp + 'px',
			"width" : this.wp + 'px',
			"padding-top" : this.top_margin + 'px',
			"margin-top" : this.top_margin + 'px',
			"margin-bottom" : '100px',
			"background-color" : "#fff"
		});
		page.css({
			"left" : ((this.obj.width() - this.wp) / 2) + 'px'
		});
		page.append($('<center></center>').append(cc));
		this.obj.append($('<center></center>').append(page));

	}

}
