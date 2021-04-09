const express = require('express')
const app = express()
const port = 3000
var fs = require("fs");
var path = require('path');
var qs = require('querystring');
var sanitizeHtml= require('sanitize-html');
var template =require('./lib/template.js');

app.get('/', (req, res) => {
  fs.readdir("./data", function (error, filelist) {
            var title = "Welcome";
            var description = "Hello, Node.js";
            var list = template.list(filelist);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>`
            );
            res.send(html);
          });
})

app.get('/page/:pageId', (req, res) => {
        fs.readdir("./data", function (error, filelist) {
        var filteredId = path.parse(req.params.pageId).base;
        fs.readFile(`data/${filteredId}`,"utf8",
          function (err, description) {
            var title = req.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description,{
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle,list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              `<a href="/create">create</a> 
               <a href="/update/${sanitizedTitle}">update</a>
               <form action="/delete" method="post">
               <input type="hidden" name="id" value="${sanitizedTitle}">
               <input type="submit" value="delete">
               </form>`
            );
            res.send(html);
          }
        );
      });
})

app.get('/create',(req, res) => {
      fs.readdir("./data", function (error, filelist) {
      var title = "WEB - create";
      var list = template.list(filelist);
      var html = template.HTML(
        title,
        list,
        `<form action="/create"
      method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit" />
        </p>
      </form>`,
        ""
      );
      res.send(html);
    });
})

app.post('/create', (req, res) => {
  var body = "";
req.on("data", function (data) {
  body += data;
});
req.on("end", function () {
  var post = qs.parse(body);
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, "utf8", function (err) {
    res.writeHead(302, { Location: `/?id=${title}` });
    res.end("");
  });
});
})

app.get('/update/:pageId',(req, res) => {
  fs.readdir("./data", function (error, filelist) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
      var title = req.params.pageId;
      var list = template.list(filelist);
      var html = template.HTML(
        title,
        list,
        `
          <form action="/update" method="post">
          <input type="hidden" name="id" value="${title}">
      <p><input type="text" name="title" placeholder="title" value="${title}"></p>
      <p>
        <textarea name="description" placeholder="description">${description}</textarea>
      </p>
      <p>
        <input type="submit" />
      </p>
    </form>
          `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
      );
      res.send(html);
    });
  });
})

app.post('/update',(req, res) => {
    var body = '';
    req.on("data", function (data) {
      body += data;
    });
    req.on("end", function () {
      var post = qs.parse(body);
      var id= post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`,`data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          res.redirect(`/?id=${title}`);
        });
      });
    });
})
app.post('/delete',(req, res) => {
      var body = '';
    req.on("data", function (data) {
      body += data;
    });
    req.on("end", function () {
      var post = qs.parse(body);
      var id= post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function(error){
        res.redirect('/');
      })
    });
})
// app.get('/create',(req, res) => {
  
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// var http = require("http");
// var url = require("url");



// var app = http.createServer(function (req, res) {
//   var _url = req.url;
//   var queryData = url.parse(_url, true).query;
//   var pathname = url.parse(_url, true).pathname;

//   if (pathname === "/") {
//     if (queryData.id === undefined) {
//     } else {
//     }
//   } else if (pathname === "/create") {
//   } else if (pathname === "/create_process") {
//   } else if (pathname === "/update") {
//   } else if (pathname === "/update_process") {
//   } else if (pathname === "/delete_process") {
//   }else {
//     res.writeHead(404);
//     res.end("Not found");
//   }
// });
// app.listen(3000); //포트번호지정
