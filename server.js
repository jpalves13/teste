var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    url = require('url'),
    objectId = require('mongodb').ObjectID;
	
var app = express();

// body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "content-type");
	next();
});

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
    'teste',
    new mongodb.Server('localhost',27017,{}),
    {}
);

console.log('Servidor HTTP esta escutando na porta ' + port);

//BOTS
// POST
app.post('/bots', function(req, res){
    var dados = {
        name: req.body.name
    }

    db.open(function(err, mongoclient){
        mongoclient.collection('bots', function(err, collection){
            collection.insert(dados, function(err, records){
                if(err){
                    res.json({'status': 'erro'});
                }else{
                    res.json({'status': 'inclusao realizada com sucesso'});
                }
                mongoclient.close();
            });
        });
    });
});

// GET
app.get('/bots', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('bots', function(err, collection){
            collection.find().toArray(function(err, results){
                if(err){
                    res.json(err);
                }else{
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });
});

// GET by ID(ready)
app.get('/bots/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('bots', function(err, collection){
            collection.find(objectId(req.params.id)).toArray(function(err, results){
                if(err){
                    res.json(err);
                }else{
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });
});

// PUT by ID(update)
app.put('/bots/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('bots', function(err, collection){
            collection.update(
                { _id : objectId(req.params.id) },
                { $set : { name : req.body.name }},
                {},
                function(err, records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                    mongoclient.close();
                }
            );
        });
    });
});

// DELETE by ID(delete)
app.delete('/bots/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('bots', function(err, collection){
            collection.remove(
                { _id : objectId(req.params.id) },
                function(err, records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                    mongoclient.close();
                }  
            );
        });
    });
});

//MESSAGES
// POST(create)
app.post('/messages', function(req, res){

    var date = new Date();
	var time_stamp = date.getTime();
    
    var dados = {
        conversationId: req.body.conversationId,
        timestamp: time_stamp,
        from: req.body.from,
        to: req.body.to,
        text: req.body.text
    }

    db.open(function(err, mongoclient){
        mongoclient.collection('messages', function(err, collection){
            collection.insert(dados, function(err, records){
                if(err){
                    res.json({'status': 'erro'});
                }else{
                    res.json({'status': 'inclusao realizada com sucesso'});
                }
                mongoclient.close();
            });
        });
    });
});



// GET by ID
app.get('/messages/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('messages', function(err, collection){
            collection.find(objectId(req.params.id)).toArray(function(err, results){
                if(err){
                    res.json(err);
                }else{
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });
});


// GET by conversationId
app.get('/messages', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('messages', function(err, collection){
            var query = { conversationId: req.query.conversationId };
            db.collection("messages").find(query).toArray(function(err, results) {
                if(err){
                    res.json(err);
                }else{
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });
});
