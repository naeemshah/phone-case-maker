var express = require('express');
var fs = require('fs');
var formidable = require('formidable');

var path = require('path');
var hostname = process.env.HOST_NAME || 'localhost';
var port = process.env.PORT || 8000;

var app = express();
var publicPath = path.join(__dirname, '..', 'dist');

app.use(express.static(publicPath));

app.post('/upload-background', (req, res) => {
  new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
      var fileExt = path.extname(file.name);
      var dir = path.join(__dirname, '..', 'dist', 'images', 'uploaded');
      if(!fs.existsSync(dir)) {
        fs.mkdirSysnc(dir);
      }
      file.name = 'uploaded' + fileExt;
      file.path = path.join(dir, file.name);
    })
    .on('file', (name, file) => {
      res.write(JSON.stringify({ file: file.name }));
    })
    .on('end', () => {
      res.end();
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up on http://' + hostname + ':' + port);
});
