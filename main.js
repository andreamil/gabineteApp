const{ app, BrowserWindow, ipcMain, dialog, shell } = require('electron');

const path = require('path');
const log = require('electron-log');
const { autoUpdater }  = require('electron-updater');


//Mantém a referência global do objeto da janela.
//se você não fizer isso,
// a janela será fechada automaticamente
// quando o objeto JavaScript for coletado como lixo.
let win

/*require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});*/
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}
function createWindow () {
  // Criar uma janela de navegação.
  
  win = new BrowserWindow({ width: 1300, height: 700,webPreferences: {
    zoomFactor: 2.0,
     plugins: true 
  }})

  // e carrega index.html do app.
  win.loadFile('index.html')

  // Emitido quando a janela é fechada.
  win.on('closed', () => {
    // Elimina a referência do objeto da janela, geralmente você iria armazenar as janelas
    // em um array, se seu app suporta várias janelas, este é o momento
    // quando você deve excluir o elemento correspondente.
    win = null
  })

}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');  

})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  const options = {
    type: 'question',
    buttons: ['Cancelar', 'Sim'],
    defaultId: 0,
    title: 'Atualização',
    message: 'Atualizar',
    detail: 'Fechar e instalar atualização agora? (dados não salvos serão perdidos)',
  };

  dialog.showMessageBox(null, options, (response) => {
    console.log(response);
    
    if(response==1)autoUpdater.quitAndInstall();
  });
});
// Este método será chamado quando o Electron tiver finalizado
// a inicialização e está pronto para criar a janela browser.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.on('ready', createWindow)
// Finaliza quando todas as janelas estiverem fechadas.
app.on('window-all-closed', () => {
  // No macOS é comum para aplicativos e sua barra de menu 
  // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('gerarEtiquetas', function (event, params) {

});
app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});
// ipcMain.on('checkUpdate', function (event, from) {
//   log.transports.file.level = "debug"
//   autoUpdater.logger = log
//     autoUpdater.checkForUpdatesAndNotify()
// });

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// Neste arquivo, você pode incluir o resto do seu aplicativo especifico do processo
// principal. Você também pode colocar eles em arquivos separados e requeridos-as aqui.