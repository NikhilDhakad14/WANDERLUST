const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");


app.use(cookieParser("secret "));

app.get("/acookie",(req,res)=>{
    res.cookie("color","red");
    res.send("unsigned cookie");
});

app.get("/cookie",(req,res)=>{
    res.cookie("user","nikhil",{signed:true});
    res.send("login");
});

app.get("/profile",(req,res)=>{
    if(req.signedCookies.user){
        res.send(req.signedCookies);
    }else{
        res.send("not verified");
    }
});
//SAVING SEESION INFO AND USE IT

app.get("/info",(req,res)=>{
    let {name = "jholu"}=req.query;
    req.session.name=name;
    res.redirect("/use");
});
app.get("/use",(req,res)=>{
    res.send(`hello,${req.session.name}`);
})

app.listen(8080,()=>{
    console.log("cookie server");
})