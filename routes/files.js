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
        const url = req.originalUrl.replaceAll("%C2%B7",".");
        
        if(!url.match(/\.\.+/)){
            if(url.match(/[^/]+\.[^./]+$/)){
                res.sendFile(path+url);
            }
            else{
                try{
                    if(url!="/"){
                        res.locals.files.push({
                            name:"..",
                            type:"folder",
                            url:plib.dirname(url)
                        })
                    }
                    res.locals.title = plib.basename(plib.dirname(url));
                    let files = fs.readdirSync(path+url);
                    for(f of files){
                        res.locals.files.push({
                            name:f,
                            type:f.match(/[^/]+\.[^./]+$/)?"file":"folder",
                            url:(url+(url=="/"?"":"/")+f).replaceAll(".","·")
                        });
                    }
                    next();
                }
                catch{
                    res.render("error",{code:404});
                }
            }
        }
        else{
            res.render("error",{code:404});
        }

        
    });

}