/*！
 * 这里的代码用于将不同的类型的表格进行存储
 */
golbal.BASEStatus = {
	stdTr:{},
	stdTrHeight:36,
	projectAccessed : false,
	project : {
		projectName : "",
		projectId:"",
		excelAccessed : false,
		excel : {
			excelId : "",
			excelType : "",
			tableAccessed : false,
			table : {
				tableId : "",
				tableType : ""
			}
		}
	},switchProject : function (projectId) {
		this.projectAccessed = true;
		this.projectId = projectId;
		//刚切换excel后table不可以访问
		this.project.excelAccessed = false;
	},
	switchExcel : function (pexcelId, pexcelType) {
		this.project.excelAccessed = true;
		this.project.excel.excelId = pexcelId;
		this.project.excel.excelType = pexcelType;
		//刚切换excel后table不可以访问
		this.project.excel.tableAccessed = false;
	},
	switchTable : function (tableId, tableType) {
		this.project.excel.tableAccessed = true;
		this.project.excel.table.tableId = tableId;
		this.project.excel.table.tableType = tableType;
		//切换时还原默认数据
		this.stdTrHeight=36;
		this.stdTr={};
	},
	getProjectObj : function () {
		return this.project;
	},
	getExcelObj : function () {
		return this.project.excel;
	},
	getTableObj : function () {
		return this.project.excel.table;
	},
	canUseExcel:function(){
		if(this.project.excelAccessed)return true;
		alert('excel不可访问');
		return false;
	},
	canUseTbale:function(){
		if(this.project.excel.tableAccessed)return true;
		alert('table不可访问');
		return false;
	}
};
