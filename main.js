const electron = require('electron')

	var BASEINFO = {
	'SERVER_ROOT' : 'http://localhost:8080/simpleMVC/',
	'fun_btn' : 'o_p',
	'center' : 'work_center',
	'pro_id' : '1',
	'pro_name' : '',
	'renYuanId' : '23',
	'yongHuMing' : '',
	'quanXian' : ''
}
var WINDOWSLIST = {};
const ipcMain = require('electron').ipcMain;

ipcMain.on('getbaseinfo', function (event, arg) {
	//console.log(JSON.stringify(BASEINFO));
	event.sender.send('getbaseinfo-reply', JSON.stringify(BASEINFO));
});
ipcMain.on('setbaseinfo', function (event, arg) {
	console.log(arg);
});
ipcMain.on('open_new_project', function (e, data) {
	let tem = eval('(' + data + ')');
	BASEINFO.pro_id = tem.pro_id;
	BASEINFO.pro_name = tem.pro_name;
	console.log(BASEINFO.pro_name);
	WINDOWSLIST['gong_zuo_chuang_kou_'].reload();
	try {
		//console.log("WINDOWSLIST['xiang_mu_guan_li_'].close()");
		WINDOWSLIST['xiang_mu_guan_li_'].close();
	} catch (err) {}

});

ipcMain.on('login_message', function (e, data) {
	//data的数据类型{"uname":xxx,"mask":xxx}
	//console.log(data);
	var user_info = eval("(" + data + ")");
	//	'yongHuMing'	 :'',
	//'quanXian'		 :''
	BASEINFO.yongHuMing = user_info['uname'];
	BASEINFO.quanXian = user_info['mask'];
	WINDOWSLIST['gong_zuo_chuang_kou_'] = createWorkPlatWindows(data);
	mainWindow.close();
})
//工作、流程、监管放到菜单位置
//完全按照Adobe界面，上部依次是“系统管理、编辑、视图、窗口、帮助”，下部是工具条
const template = [{
		label : '系统',
		submenu : [{
				label : '企业信息',
				accelerator : 'CmdOrCtrl+Q',
				click : function () {
					WINDOWSLIST['qi_ye_xin_xi_'] = createCompanyInfoWindows();
				}
			}, {
				label : '项目管理',
				accelerator : 'CmdOrCtrl+N',
				click : function () {
					WINDOWSLIST['xiang_mu_guan_li_'] = createCreateProjectWindows();
				}

			}
			/*, {
			label : '项目列表',
			accelerator : 'CmdOrCtrl+L',
			click : createProjectListWindows
			}*/
		, {
				label : '人员管理',
				accelerator : 'CmdOrCtrl+P',
				click : function () {
					WINDOWSLIST['ren_yuan_guan_li_'] = createStaffManagementWindows();
				}
			}, {
				label : '外协单位',
				//accelerator : 'CmdOrCtrl+C',
				//click : createOutreachUnitWindows
				submenu : [{
						label : '单位管理',
						accelerator : 'CmdOrCtrl+O',
						click : function () {
							WINDOWSLIST['dan_wei_guan_li_'] = createOutreachUnitWindows();
						}
					}
					/*,{
					label : '人员管理(旧)',
					accelerator : 'CmdOrCtrl+C',
					click : createOutStaffManagementWindows
					}*/
				, {
						label : '人员管理',
						accelerator : 'CmdOrCtrl+C',
						click : function () {
							WINDOWSLIST['ren_yuan_guan_li_'] = createOutStaffManagemenNewtWindows();
						}
					}
				]
			}
		]
	}, {
		label : '项目',
		submenu : [{
				label : '人员配置',
				accelerator : 'CmdOrCtrl+S',
				click : function () {
					WINDOWSLIST['ren_yuan_pei_zhi_'] = createProjecStaffManagementWindows();
				}
			}, {
				label : '表单设置',
				accelerator : 'CmdOrCtrl+T',
				click : function () {
					WINDOWSLIST['biao_dan_she_zhi_'] = createProjectTablesManagementWindows();
				}
			}, {
				label : '权责配置',
				accelerator : 'CmdOrCtrl+R',
				click : function () {
					WINDOWSLIST['quan_ze_pei_zhi_'] = createRightsAndResponsibilitySetWindows();
				}
			}, {
				label : '流程配置',
				accelerator : 'CmdOrCtrl+D',
				click : function () {
					WINDOWSLIST['liu_cheng_pei_zhi_'] = createProcedureSetWindows();
				}
			}, {
				label : '外协单位',
				submenu : [{
						label : '人员配置',
						accelerator : 'CmdOrCtrl+S',
						click : function () {
							WINDOWSLIST['ren_yuan_pei_zhi_'] = createProjecStaffManagementWindows();
						}
					}, {
						label : '表单设置',
						accelerator : 'CmdOrCtrl+T',
						click : function () {
							WINDOWSLIST['biao_dan_she_zhi_'] = createProjectTablesManagementWindows();
						}
					}, {
						label : '权责配置',
						accelerator : 'CmdOrCtrl+R',
						click : function () {
							WINDOWSLIST['quan_zhi_pei_zhi_'] = createRightsAndResponsibilitySetWindows();
						}
					}, {
						label : '流程配置',
						accelerator : 'CmdOrCtrl+D',
						click : function () {
							WINDOWSLIST['liu_cheng_pei_zhi_'] = createProcedureSetWindows();
						}

					}
				]
			}
		]
	}, {
		label : '视图',
		submenu : [{
				role : 'undo'
			}, {
				role : 'redo'
			}
		]
	}, {
		label : '窗口',
		submenu : [{
				role : 'reload'
			}, {
				role : 'forcereload'
			}, {
				role : 'toggledevtools'
			}
		]
	}, {
		label : '帮助',
		submenu : [{
				label : '重载界面',
				role : 'reload'
			}, {
				label : '强制重载',
				role : 'forcereload'
			}, {
				label : '打开调试器',
				role : 'toggledevtools'
			}, {
				label : '查看帮助',
				click : function () {
					electron.shell.openExternal('http://www.baidu.com')
				}
			}, {
				label : '关于...',
				click : createCompanyInfoWindows
			}
		]
	}
]

const menu = electron.Menu.buildFromTemplate(template);
electron.Menu.setApplicationMenu(menu);

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
//自定义变量区——全局变量

//创建项目的表单管理的页面
//项目ID先写硬编码


//创建权责配置窗口createRightsAndResponsibilitySetWindows
function createRightsAndResponsibilitySetWindows() {
	var newWin = new BrowserWindow({
			//width : 1000,
			//height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	newWin.on('closed', function () {
		win = null;
	});

	newWin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/rightsResponsibilitySet.html'),
			protocol : 'file:',
			slashes : true
		}));
	newWin.show();
	newWin.maximize();
	newWin.webContents.openDevTools();

	return newWin;
}

//创建固定流程配置的窗口
function createProcedureSetWindows() {
	var newWin = new BrowserWindow({
			//width : 1000,
			//height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	newWin.on('closed', function () {
		win = null;
	});

	newWin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/procedureSet.html'),
			protocol : 'file:',
			slashes : true
		}));
	newWin.show();
	newWin.maximize();
	newWin.webContents.openDevTools();

	return newWin;
}

function createProjectTablesManagementWindows() {
	var newWin = new BrowserWindow({
			width : 1000,
			height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	newWin.on('closed', function () {
		win = null;
	});

	newWin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/projectTabs.html'),
			protocol : 'file:',
			slashes : true
		}));
	newWin.show();
	newWin.webContents.openDevTools();
	return newWin;
}

//创建为项目添加人员的界面
//项目ID先写死
function createProjecStaffManagementWindows() {
	var newWin = new BrowserWindow({
			//width : 1000,
			//height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	newWin.on('closed', function () {
		win = null;
	});

	newWin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/projectStaff.html'),
			protocol : 'file:',
			slashes : true
		}));
	newWin.show();
	newWin.maximize();
	newWin.webContents.openDevTools();
	return newWin;
}
function createCreateProjectWindows() {
	var win = new BrowserWindow({
			//width : 1200,
			//height : 600,
			show : false,
			autoHideMenuBar : true,
			//fullscreen:true,
			frame : true
		});
	win.on('closed', function () {
		win = null;
	});

	win.loadURL(url.format({
			pathname : path.join(__dirname, 'www/createProject.html'),
			protocol : 'file:',
			slashes : true
		}));
	win.show();
	win.maximize();
	win.webContents.openDevTools();

	return win;
}
function createOutStaffManagemenNewtWindows() {
	var newWin = new BrowserWindow({
			//width : 1000,
			//height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	newWin.on('closed', function () {
		win = null;
	});

	newWin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/staffManageNew.html'),
			protocol : 'file:',
			slashes : true
		}));
	newWin.show();
	newWin.maximize();
	newWin.webContents.openDevTools();
	return newWin;
}
//创建一个新的窗口，来管理外协单位人员
function createOutStaffManagementWindows() {
	var staffWin = new BrowserWindow({
			width : 800,
			height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	staffWin.on('closed', function () {
		win = null;
	});

	staffWin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/staffManageOld.html'),
			protocol : 'file:',
			slashes : true
		}));
	staffWin.show();
	staffWin.webContents.openDevTools();
	return staffWin;
}
//创建一个新的窗口，来管理人员
function createStaffManagementWindows() {
	var staffWin = new BrowserWindow({
			width : 800,
			height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	staffWin.on('closed', function () {
		win = null;
	});

	staffWin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/staffManage.html'),
			protocol : 'file:',
			slashes : true
		}));
	staffWin.show();
	staffWin.webContents.openDevTools();
	return staffWin;
}
//创建一个窗口，用来管理外协单位的信息
function createOutreachUnitWindows() {
	var outUnitsWin = new BrowserWindow({
			width : 1000,
			height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	outUnitsWin.on('closed', function () {
		win = null;
	});

	outUnitsWin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/outReachUnits.html'),
			protocol : 'file:',
			slashes : true
		}));
	outUnitsWin.show();
	outUnitsWin.webContents.openDevTools();
	return outUnitsWin;

}
//创建一个窗口，用来查看或者更新本公司信息
function createCompanyInfoWindows() {

	var companyin = new BrowserWindow({
			width : 800,
			height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	companyin.on('closed', function () {
		win = null;
	});

	companyin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/companyInfo.html'),
			protocol : 'file:',
			slashes : true
		}));
	companyin.show();
	companyin.webContents.openDevTools();
	return companyin;
}

function createProjectListWindows() {

	var win = new BrowserWindow({
			width : 800,
			height : 600,
			show : false,
			autoHideMenuBar : true,
			frame : true
		});
	win.on('closed', function () {
		win = null;
	});

	win.loadURL(url.format({
			pathname : path.join(__dirname, 'www/searchProject.html'),
			protocol : 'file:',
			slashes : true
		}));
	win.show();

	return win;
}
//登录成功以后，创建新的工作窗口
function createWorkPlatWindows(userInfo) {
	var workwin = new BrowserWindow({
			width : 1000,
			height : 650,
			/*fullscreen为true的时候会隐藏顶部的全屏关闭窗口的功能栏*/
			//fullscreen:true,
			autoHideMenuBar : false,
			icon : 'www/images/logo.png',
			darkTheme : true,
			frame : true
		});

	workwin.loadURL(url.format({
			pathname : path.join(__dirname, 'www/index.html'),
			protocol : 'file:',
			slashes : true
		}));
	workwin.show();

	workwin.on('closed', function () {
		workwin = null;
	});
	return workwin;
}
//登陆界面
function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
			width : 800,
			height : 600,
			autoHideMenuBar : true,
			icon : 'www/images/logo.png',
			darkTheme : true,
			/*全屏*/
			//fullscreen:true,
			/*窗口最上方的全屏关闭栏*/
			//frame: false,
			// backgroundColor :'#000',
		})
		//mainWindow.maximize();
		// and load the index.html of the app.
		mainWindow.loadURL(url.format({
				//暂时改成login.html
				pathname : path.join(__dirname, 'www/login.html'),
				protocol : 'file:',
				slashes : true
			}))

		// 打开调试器
		mainWindow.webContents.openDevTools()

		// Emitted when the window is closed.
		mainWindow.on('closed', function () {

			mainWindow = null
		})
		mainWindow.webContents.on('did-finish-load', function () {
			mainWindow.webContents.send('zxy', 'zxy_whooooo55555oooooo');
		});

	return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
	WINDOWSLIST['deng_lu_'] = createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
