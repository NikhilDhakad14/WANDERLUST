const express=require("express");
const app=express();
const session=require("express-session");

app.use(
    session({
        secret:"mysecret",
        resave:false,
        saveUninitialized:true
    })
);
app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++
    }else{
        req.session.count=1
    }
    res.send(`you sent ${req.session.count} times`);
});

app.get("/test",(req,res)=>{
    res.send("test success");
});


app.listen(8080,()=>{
    console.log("server is connected");
})