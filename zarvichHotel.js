var express = require('express');
var zarvich = express();
var dotenv = require('dotenv');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
dotenv.config();
var MongoUrl = "mongodb+srv://test:testuser@cluster0.gcwdn.mongodb.net/Hotels?retryWrites=true&w=majority";
var cors = require('cors')
const bodyparser = require('body-parser');
const res = require('express/lib/response');
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

//return roomtypes wrt filters


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


// post bookings to reservation database 
zarvich.post('/bookNow',(req,res)=>{
	console.log(req.body);
	db.collection('reservations').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Reservation Placed")
	})
})
//Delete bookings in Reservation (Note the Query)
zarvich.delete('/delBooking',(req,res)=>{
    var query = req.query.user_id
    db.collection('reservations').deleteOne({user_id:query},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//Delete pictures in Home Page carousel
zarvich.delete('/homepixdel',(req,res)=>{
     var query = req.query.gallery_id
    db.collection('homePageGallery').deleteOne({gallery_id:query},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//post pictures to home page carousel
zarvich.post('/homepix',(req,res)=>{
	console.log(req.body);
	db.collection('homePageGallery').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Reservation Placed")
	})
})

//return all home page carousel
zarvich.get('/homegallery', (req,res) => {
    db.collection('homePageGallery').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all home page Images
zarvich.get('/homecarousel', (req,res) => {
    db.collection('homepagecarousel').find().toArray((err,result) => {
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

//Delete pictures in room Page Gallery
zarvich.delete('/roompixdel',(req,res)=>{
    var query = req.query.image_id
   db.collection('roomtypeGallery').deleteOne({image_id:query},(err,result)=>{
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


//return all hotel gallery
zarvich.get('/hotelpics', (req,res) => {
    db.collection('HotelPix').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//Delete pictures in hotel Gallery
zarvich.delete('/delhotelpics',(req,res)=>{
    var query = req.query.hotelp_id
   db.collection('HotelPix').deleteOne({hotelp_id:query},(err,result)=>{
       if(err) throw err;
       res.send(result)
   })
})

//post pictures to hotel Gallery
zarvich.post('/addhotelpics',(req,res)=>{
   console.log(req.body);
   db.collection('HotelPix').insertOne(req.body,(err,result)=>{
       if(err) throw err;
       res.send("Reservation Placed")
   })
})


zarvich.post('/addnewsletter',(req,res)=>{
    console.log(req.body);
    db.collection('newsletter').insertOne(req.body,(err,result)=>{
        if(err) throw err;
        res.send("email added")
    })
 })
 
 zarvich.get('/allnewsletter', (req,res) => {
    db.collection('newsletter').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return all facilities (Param)
zarvich.get('/amenities',(req,res) => {
    var query = {};
    console.log(req.query.facilities)
    if(req.query.facilities){
        query={facility_id:Number(req.query.facilities)}
    }


 // return all facilities wrt roomID (Query Param)
    else if(req.query.RoomID){
        var RoomID = (req.query.RoomID)
        query={"roomtype_id":Number(req.query.RoomID)}
    }

db.collection('roomFacility').find(query).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
    })
})



MongoClient.connect(MongoUrl, (err,client) => {
    if(err) console.log("error while connecting");
    db = client.db('Hotels');
    zarvich.listen(port,()=>{
        console.log(`listening on port ${port}`)
    })
})
