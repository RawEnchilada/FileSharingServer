const fs = require("fs");
const plib = require("path");

let path = "";

try {
	const data = fs.readFileSync('./config.json', 'utf8');
	const json = JSON.parse(data);
	path = json.sharePath;
} catch (err) {
	console.log(err);
}

module.exports = (app)=>{

    app.post("/upload",(req,res,next)=>{
        let file;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("No files to upload!");
            return res.status(400).send('No files were uploaded.');
        }

        file = req.files.file;
        console.log(file);
        uploadPath = plib.dirname(__dirname) + '/upload/' + file.name;

        file.mv(uploadPath, function(err) {
            if(err)res.send("Failed");
            else res.send("Success");
        });
    });

    app.use((req,res,next)=>{
        const url = decodeURI(req.originalUrl);
        
        if(!url.match(/\.\.+/)){
            if(!fs.lstatSync(path+url).isDirectory()){
                res.sendFile(path+url);
            }
            else{
                try{
                    if(url!="/"){
                        res.locals.files.push({
                            name:"..",
                            type:"folder",
                            url:plib.dirname(url)
                        });
                        res.locals.title = plib.basename(url);
                    }
                    let files = fs.readdirSync(path+url);
                    for(f of files){
                        if(f[0] == ".")continue;
                        res.locals.files.push({
                            name:f,
                            type:fs.lstatSync(path+url+(url=="/"?"":"/")+f).isDirectory()?"folder":"file",
                            url:encodeURI(url+(url=="/"?"":"/")+f)
                        });
                    }
                    next();
                }
                catch{
                    console.log("Path not found");
                    res.render("error",{code:404});
                }
            }
        }
        else{
            console.log("Double dot detected");
            res.render("error",{code:404});
        }

        
    });

}