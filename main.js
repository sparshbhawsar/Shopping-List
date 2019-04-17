const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow, Menu, ipcMain} = electron;

process.env.NODE_ENV = 'production';


let mainWindow;
let addwindow;

app.on('ready', function(){
mainWindow = new BrowserWindow({});
mainWindow.loadURL(url.format({

    pathname: path.join(__dirname,'mainWindow.html'),
    protocol: 'file:',
    slashes: true

}));


mainWindow.on('closed',function(){
    app.quit();
});

const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu);

});


function createAddWindow(){

        addwindow = new BrowserWindow({
           width: 300,
           height: 200,
           title: 'Add shopping list item'
        });
           
        addwindow.loadURL(url.format({
        
            pathname: path.join(__dirname,'addWindow.html'),
            protocol: 'file:',
            slashes: true
        
        }));
        addwindow.on('close',function(){
        addwindow = null;
        });


    }



    ipcMain.on('item:add',function(e, item){
        console.log(item);
        mainWindow.webContents.send('item:add',item);
        addwindow.close();
    });
const mainMenuTemplate = [ 
    {
        label:'File',
        submenu: [{
            label: 'Add Item',
            click(){
                createAddWindow();
            }
        },
        {
            label:'Clear Item',
            click(){
                mainWindow.webContents.send('item:clear');
           }
        },
        {
            label:'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
                app.quit();
            }
        },
    ]
    }

    ];

    if(process.platform == 'darwin'){
        mainMenuTemplate.unshift({});
    }
    
    if(process.env.NODE_ENV != 'production'){
        mainMenuTemplate.push({
            label: 'Developer tools',
            submenu:[
                {
                    label:'toggle Devtools',
                    accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                    click(item,focusedwindow){
                        focusedwindow.toggleDevTools();
                    }

                },
                {
                    role:'reload'
                }
            ]

        });
    }