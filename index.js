const express = require("express");
const fs = require("fs");
const fu = require('express-fileupload');

let port = 4200;
let app = express();

try {
	const data = fs.readFileSync('./config.json', 'utf8');
	const json = JSON.parse(data);
	port = json.serverPort;
} catch (err) {
	console.log(err);
}

app.set("view engine","ejs");

app.use(express.static("static"));
app.use(fu())

app.use((req,res,next)=>{
    res.locals.files=[];
    res.locals.title="Shared Folder"
    next();
});
require("./routes/files")(app);
require("./routes/render")(app);


let server = app.listen(port,()=>{
    console.log("Listening on port "+port+"...");
});
