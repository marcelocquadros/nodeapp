const express  = require('express');
const app =  express();
const bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

var db = null;
MongoClient.connect('mongodb://localhost/test', function(err, database) {
  if(err) throw err;
  db = database;
  console.log('successfully connection');
    app.listen(3000, function() {
      console.log('listening on 3000')
    })
})


app.post('/person', function(req, resp){

    db.collection('person').save(req.body, function(err,result){
      resp.send(200);
    })
    
})



app.get('/person', function(req, resp){
    db.collection('person').find().toArray(function(err,result) {
      resp.send(result);
    })
})


app.get('/person/:id', function(req, resp){
    var id = req.params.id;
    db.collection('person').findOne({'_id': ObjectId(id)},function(err,result){
      resp.send(result);
    })
})

app.put('/person', function(req, resp){
    var id = req.body._id;
    var newObj = req.body;
    delete newObj._id;
    db.collection('person').findOneAndUpdate(
      {'_id': ObjectId(id)},
      {$set: newObj},{returnOriginal:false, upsert:true},

      function(err, result){
      
       if(err) throw err;

       resp.send(result);
    });
  }
)

app.delete('/person/:id', function(req,resp){
   var id = req.params.id;
   db.collection('person').deleteOne({'_id': ObjectId(id)},function(err, result){
      if(err) throw e;
      resp.sendStatus(200);
   })
})
