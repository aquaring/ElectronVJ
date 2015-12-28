'use strict';

const electron = require('electron');
const app = electron.app;  // アプリケーション作成用モジュール
const BrowserWindow = electron.BrowserWindow;  // メインウィンドウ作成用モジュール

//  クラッシュレポート
require('crash-reporter').start();

var mainWindow = null;

// 全てのウィンドウが閉じたら、アプリケーションを終了する
app.on('window-all-closed', function () {
	app.quit();
});

// アプリケーション初期化完了後
app.on('ready', function () {
	// メインウィンドウ
	mainWindow = new BrowserWindow({ width: 800, height: 600, 'node-integration': false});

	// 読み込み
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	
	// デバッグ
	// mainWindow.webContents.openDevTools();
	// メインウィンドウを閉じた時
	mainWindow.on('closed', function () {

		mainWindow = null;
	});
});