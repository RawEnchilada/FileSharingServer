module.exports = (app)=>{

    app.use((req,res,next)=>{
        res.render("main",{locals:res.locals});
    });


}