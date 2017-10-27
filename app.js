const http = require('http');
const express = require('express');
const app = express();
app.use("/", express.static(__dirname + '/public'));

// 创建服务端
const port = '5000'
http.createServer(app).listen(port, function() {
	console.log('启动服务器完成,监听: ',port,'端口');
});