const electron = require('electron')

var BASEINFO={
	//'SERVER_ROOT':'http://localhost:8080/simpleMVC/',
	'SERVER_ROOT':'http://172.20.32.125:8080/simpleMVC/',
	'fun_btn':'o_p',
	'center':'work_center',
	'pro_id':'1',
	'renYuanId':'23'
}

const ipcMain = require('electron').ipcMain;
ipcMain.on('getbaseinfo', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.sender.send('getbaseinfo-reply', JSON.stringify(BASEINFO));
});




	//工作、流程、监管放到菜单位置
	//完全按照Adobe界面，上部依次是“系统管理、编辑、视图、窗口、帮助”，下部是工具条
	const template = [{
			label : '系统管理',
			submenu : [{
					label : '新建项目',
					accelerator : 'CmdOrCtrl+N',
					click : createCreateProjectWindows

				}, {
					label : '项目列表',
					accelerator : 'CmdOrCtrl+L',
					click : createProjectListWindows
				}, {
					label : '外协单位',
					accelerator : 'CmdOrCtrl+C',
					click : createOutreachUnitWindows
				}, {
					label : '人员管理',
					accelerator : 'CmdOrCtrl+P',
					click : createStaffManagementWindows
				}
			]
		}, {
			label : '项目',
			submenu : [{
					label : '人员设置',
					accelerator : 'CmdOrCtrl+S',
					click : createProjecStaffManagementWindows
				},{
					label : '表单设置',
					accelerator : 'CmdOrCtrl+T',
					click : createProjectTablesManagementWindows
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

	const menu = electron.Menu.buildFromTemplate(template)
	electron.Menu.setApplicationMenu(menu)

	const app = electron.app
	const BrowserWindow = electron.BrowserWindow
	const path = require('path')
	const url = require('url')

	global.webserver = '127.0.0.1'

	// Keep a global reference of the window object, if you don't, the window will
	// be closed automatically when the JavaScript object is garbage collected.
	let mainWindow
//自定义变量区——全局变量

const SERVER_URL = 'http://localhost:80';
//创建项目的表单管理的页面
//项目ID先写死
function createProjectTablesManagementWindows(){
	var newWin=new BrowserWindow({
		width : 1000,
		height : 600,
		show : false,
		autoHideMenuBar:true,
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
	
	newWin.webContents.on('did-finish-load', function () {
		newWin.webContents.send('page_par', '{"SERVER_ROOT":"'+SERVER_URL+'","PROJECT_ID":"1"}');
	});		
}
//创建为项目添加人员的界面
//项目ID先写死
function createProjecStaffManagementWindows(){
	var newWin=new BrowserWindow({
		//width : 1000,
		//height : 600,
		show : false,
		autoHideMenuBar:true,
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
	
	newWin.webContents.on('did-finish-load', function () {
		newWin.webContents.send('page_par', '{"SERVER_ROOT":"'+SERVER_URL+'","PROJECT_ID":"6"}');
	});		
}	
function createCreateProjectWindows() {
	var win = new BrowserWindow({
			//width : 1200,
			//height : 600,
			show : false,
			autoHideMenuBar:true,
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
	const ipc = require('electron').ipcMain;
	ipc.on('createProjectSuccess', function () {
		mainWindow.reload();
		win.close();
	})	

}
//创建一个新的窗口，来管理人员
function createStaffManagementWindows(){
	var staffWin=new BrowserWindow({
			width : 800,
			height : 600,
			show : false,
			autoHideMenuBar:true,
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
}
//创建一个窗口，用来管理外协单位的信息
function createOutreachUnitWindows() {
	var outUnitsWin = new BrowserWindow({
			width : 1000,
			height : 600,
			show : false,
			autoHideMenuBar:true,
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
	const ipc = require('electron').ipcMain;
	/*ipc.on('createProjectSuccess', function () {
		mainWindow.reload();
		win.close();
	})*/	

}
//创建一个窗口，用来查看或者更新本公司信息
function createCompanyInfoWindows() {

	var companyin = new BrowserWindow({
			width : 800,
			height : 600,
			show : false,
			autoHideMenuBar:true,
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
	const ipc = require('electron').ipcMain;
	/*ipc.on('createProjectSuccess', function () {
		mainWindow.reload();
		win.close();
	})*/	

}

function createProjectListWindows() {

	var win = new BrowserWindow({
			width : 800,
			height : 600,
			show : false,
			autoHideMenuBar:true,
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
	const ipc = require('electron').ipcMain;
	ipc.on('createProjectSuccess', function () {
		mainWindow.reload();
		win.close();
	})	

}
//登录成功以后，创建新的工作窗口
function createWorkPlatWindows(userInfo) {
	var workwin = new BrowserWindow({
			width : 1000,
			height : 650,
			/*fullscreen为true的时候会隐藏顶部的全屏关闭窗口的功能栏*/
			//fullscreen:true,
			autoHideMenuBar:false,
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


	workwin.webContents.on('did-finish-load', function () {
		workwin.webContents.send('page_par', '{"SERVER_ROOT":' + SERVER_URL + ',"USER_INFO":' + userInfo + '}');
	});

}
function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
			width : 800,
			height : 600,
			autoHideMenuBar:true,
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
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
	mainWindow.webContents.on('did-finish-load', function () {
		mainWindow.webContents.send('zxy', 'zxy_whooooo55555oooooo');
	});
	///------监听各种消息
	const ipc = require('electron').ipcMain;

	ipc.on('login_message', function (e,data) {
		console.log(data);
		createWorkPlatWindows(data);
		mainWindow.close();
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
