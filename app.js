//jshint esversion:6
import dotenv from "dotenv"
dotenv.config()
import express from "express"
import bodyParser from "body-parser"
import ejs from "ejs"
import mongoose from "mongoose"
import encrypt from "mongoose-encryption"



async function AppRun(){

    await mongoose.connect("mongodb://127.0.0.1:27017/UsersDB")

    const UserShema=new mongoose.Schema({
        name:String,
        password:String,
    })

    const secret = process.env.SECRET;
    UserShema.plugin(encrypt, { secret: secret,encryptedFields: ["password"]  });

    const User=mongoose.model("User",UserShema)


    const app=express()
    const port=3000
    
    app.use(express.static("public"))
    app.set("view engine","ejs")
    app.use(bodyParser.urlencoded({extended:true}))
    
    app.get("/",(req,res)=>{
        res.render("home")
    })
    
    app.get("/login",(req,res)=>{
        res.render("login")
    })
    
    
    app.get("/register",(req,res)=>{
        
        res.render("register")
    })
    
    app.post("/register",async (req,res)=>{
        
   
        const name=(req.body.username).toLowerCase()
        const password=req.body.password
        const query = User.where({ name: name});
        const CorrentUser=await query.findOne()

        if(CorrentUser){
            res.redirect("/")
        }else{
            
        const NewUser=new User({
            name:name,
            password:password
        })

      try{
        
        await NewUser.save()
         res.render("secrets")

    }catch(error){
        console.log(error)
    }


        }



        
    })

    app.post("/login",async (req,res)=>{
        const name=(req.body.username).toLowerCase()
        const password=req.body.password

        const query = User.where({ name: name});
        const CorrentUser=await query.findOne()

        

        if(CorrentUser){
            if(CorrentUser.password==password){
                res.render("secrets")
            }
        }

    })

    
    
    
    app.listen(port,()=>{
        console.log(`Listening on port ${port}`)
    })

}

AppRun()
