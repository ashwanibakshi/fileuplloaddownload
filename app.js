var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer =  require('multer');
var path = require('path');

var picSchema= new mongoose.Schema({
    picpath:String
})

var picModel = mongoose.model('picsdemo',picSchema);

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
var upload = multer({storage:storage})

var app = express();

mongoose.connect('mongodb://localhost:27017/pics',{useNewUrlParser:true})
.then(()=>console.log('connected')).catch(err=>console.log('error ocured',err));

app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');

var pathh = path.resolve(__dirname,'public');
app.use(express.static(pathh));
app.use(bodyParser.urlencoded({extended:false}));


app.get('/',(req,res)=>{
    picModel.find((err,data)=>{
        if(err){
            console.log(err)
        }
        else if(data.length>0){
            res.render('home',{data:data})
        }
        else{
            res.render('home',{data:{}})
        }
    })
})

app.post('/',upload.single('pic'),(req,res)=>{
    var x = 'uploads/'+req.file.originalname;
    var temp = new picModel({
        picpath:x
    })
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
})

app.get('/download/:id',(req,res)=>{
    picModel.find({_id:req.params.id},(err,data)=>{
         if(err){
             console.log(err)
         }
         else{
             var x= __dirname+'/public/'+data[0].picpath;
             res.download(x)
         }
    })
})

var port  = process.env.PORT || 3000 ;
app.listen(port,()=>console.log('server running at port'+port))

