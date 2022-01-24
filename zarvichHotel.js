var express = require('express');
var zarvich = express();
var dotenv = require('dotenv');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
dotenv.config();
var MongoUrl = "mongodb+srv://test:testuser@cluster0.gcwdn.mongodb.net/Hotels?retryWrites=true&w=majority";
var cors = require('cors')
const bodyparser = require('body-parser');
var port = process.env.PORT || 1400;
var db;


zarvich.use(bodyparser.urlencoded({extended:true}));
zarvich.use(bodyparser.json());
zarvich.use(cors());


zarvich.get('/',(re,res)=>{
    res.send("This is root page")
})

//return all roomtypes
zarvich.get('/rooms', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }
//return roomtypes wrt facilities
    else if(req.query.facility){
        var facility = Number(req.query.facility)
        query={'facilies.facility_id':Number(req.query.facility)}
    }

//return roomtypes wrt roomType_Id
    else if (req.query.details){
        var details= Number(req.query.details)
        query={'roomtype_id':Number(req.query.details)}
    }

    db.collection('hoteldata').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all hotel bookings
zarvich.get('/bookings', (req,res) => {
    db.collection('reservations').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all home page gallery
zarvich.get('/homegallery', (req,res) => {
    db.collection('homePageGallery').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//return all room page gallery
zarvich.get('/roomgallery', (req,res) => {
    db.collection('roomtypeGallery').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// post bookings to reservation database 
zarvich.post('/bookNow',(req,res)=>{
	console.log(req.body);
	db.collection('reservations').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Reservation Placed")
	})
})
//Delete bookings in Reservation
zarvich.delete('/delBooking',(req,res)=>{
    //var query = req.query.user_id
    db.collection('reservations').deleteOne({},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//Delete pictures in Home Page Gallery
zarvich.delete('/homepixdel',(req,res)=>{
     //var query = req.query.user_id
    db.collection('homePageGallery').deleteOne({},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//post pictures to home page Gallery
zarvich.post('/homepix',(req,res)=>{
	console.log(req.body);
	db.collection('homePageGallery').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Reservation Placed")
	})
})

//Delete pictures in room Page Gallery
zarvich.delete('/roompixdel',(req,res)=>{
    //var query = req.query.user_id
   db.collection('roomtypeGallery').deleteOne({},(err,result)=>{
       if(err) throw err;
       res.send(result)
   })
})
//post pictures to room page Gallery
zarvich.post('/roompix',(req,res)=>{
   console.log(req.body);
   db.collection('roomtypeGallery').insertOne(req.body,(err,result)=>{
       if(err) throw err;
       res.send("Reservation Placed")
   })
})

zarvich.post('/newsletter',(req,res)=>{
    console.log(req.body);
    db.collection('newsletter').insertOne(req.body,(err,result)=>{
        if(err) throw err;
        res.send("email added")
    })
 })
 




MongoClient.connect(MongoUrl, (err,client) => {
    if(err) console.log("error while connecting");
    db = client.db('Hotels');
    zarvich.listen(port,()=>{
        console.log(`listening on port ${port}`)
    })
})
