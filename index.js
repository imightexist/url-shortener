let port = 80

let express = require('express')
let app = express();
let data = require('./data.json');
let file = "data.json"
let fs = require('fs');
let http = require('http').createServer();

app.post("/*",function(req,res){
    if (req.path.endsWith("/new")){
        console.log("post request")
        shorten = req.headers["shorten"]
        url = req.headers["url"]
        if (data[shorten] == undefined && shorten.startsWith("/")){
            data[shorten] = url;
            fs.writeFileSync(file,JSON.stringify(data,null,2),"utf-8")
            console.log(shorten + " now redirects to " + url)
            res.sendStatus(201)
        }else{
            res.sendStatus(501)
            console.log("failed")
        }
    }
})
app.get("/*",function(req,res){
    if (req.path == "/" || req.path == "/index.html"){
        res.sendFile(__dirname + "/webapp/index.html")
    }else if (data[req.path] == undefined){
        console.log("invalid get")
        res.sendStatus(404)
    }else{
        console.log("redirected someone")
        //res.send("<script>window.location = '" + data[req.path] + "'</script>")
        res.redirect(data[req.path]);
    }
})
http.on('request',app)
http.listen(port)