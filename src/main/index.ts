import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { style } from './style'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    show: false,
    title: 'Kaspersky Password Manager',
    fullscreen: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    minHeight: 560,
    minWidth: 780,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.loadURL('https://my.kaspersky.com/MyPasswords#/portal/pages/kpm/all')

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const styleMin = style.replace(/\n/g, '')

  const contents = mainWindow.webContents
  contents.addListener('did-finish-load', () => {
    contents.insertCSS(styleMin)
  })
}

app.whenReady().then(() => {
  // set app user model id for windows
  electronApp.setAppUserModelId('ru.app64mb.kpm')

  // default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // on macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
