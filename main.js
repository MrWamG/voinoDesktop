const { app, BrowserWindow, win} = require('electron')
const ipc = require('electron').ipcMain;
function createWindow () {
    const win = new BrowserWindow({
        // width: 1920,
        // height: 1080,
		fullscreen: true,
        frame:false,
		transparent:true,
		resizable: false, //禁止改变主窗口尺寸
		enableRemoteModule: true,
		alwaysOnTop: false,  //窗口是否总是显示在其他窗口之前
        webPreferences: {
            nodeIntegration: true,
			enableRemoteModule: true/* Update 2020, since this answer still appears at the top. For the above to work in current versions of Electron, you need to set enableRemoteModule when creating the window in your main process. */
        }
    })
	// win.setIgnoreMouseEvents(true)
    
    win.loadFile('index.html')
    // win.webContents.openDevTools()   
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

let newWin;
const path = require('path')
ipc.on('add',()=>{
    let randomX = Math.floor(Math.random()*1320);
    let randomY = Math.floor(Math.random()*880);
    newWin = new BrowserWindow({
        width:600,
        height:200,
        x:randomX,
        y:randomY,
        frame:false,
    })
    newWin.loadURL(path.join('file:',__dirname,'index.html')); //new.html是新开窗口的渲染进程
    newWin.on('closed',()=>{newWin = null})
})