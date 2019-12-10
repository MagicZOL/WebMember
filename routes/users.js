var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET users listing. */
router.get('/', function(req, res, next) {
 
});

/*회원가입*/
router.post('/signup', function(req , res, next)
{
  var userid = req.body.userid;
  var password = req.body.password;
  var nickname = req.body.nickname;

  var db = req.app.get("database");
  
  if(db == undefined)
  {
    res.json({message : '503 Server Error'});
    return;
  }

  var validate = userValidation(userid, password);
  if(validate == false)
  {
    res.json({message : '400 Bad Request'});
  }

  var usersCollection = db.collection("users");

  usersCollection.count({'userid' : userid}, function(err, result) {
    if(err) throw(err);
    
    if(result > 0)
    {
      res.json({message : '400 Bad Request'});
      return;
    }
    else 
    {
      crypto.randomBytes(64, function(err, buf)
      {
        const saltStr = buf.toString('base64');

        crypto.pbkdf2(password, saltStr, 100, 64, 'sha512', function(err, key)
        {
          const cryptoPassword = key.toString('base64');

          usersCollection.insertOne({'userid' : userid, 'password' : cryptoPassword, 'nickname' : nickname, 'salt' : saltStr}, function(err, result) 
          {
              if (err) throw(err);
              if(result.ops.length>0)
              res.json(result.ops[0]);
              else
              res.json({message : "503 server error"});
          });
    
        });
      });
    }
  }); 
});

var userValidation = function(userid, password) {

  if(userid =="" || password=="")
  {
    return false;
  }
  if(userid.length < 6 || userid.length >12)
  {
    return false;
  }
  if(password < 8 || password > 20)
  {
    return false;
  }
  if(nickname < 4 || nickname > 20)
  {
    return false;
  }
  return true;
}

/*로그인"*/ 
router.post('/signin', function(req , res, next)
{
  var userid = req.body.userid;
  var password = req.body.password;

  var database = req.app.get("database");
  var users = database.collection("users");

  users.findOne({"userid" : userid}, function (err, user)
  {
    var salt = user.salt;
     //기존솔트, 반복횟수, 사이즈 , 알고리즘
    crypto.pbkdf2(password, salt, 100, 64, 'sha512', function(err, key)
    {
      const cryptoPassword = key.toString('base64');

      users.findOne( {$and: [ {"userid" : userid}, {"password" : cryptoPassword}]}, function(err, user) {
      if (err) res.json({message : '400 Bad Request'});
      res.json(user)
       });
    
    });
  });
});

module.exports = router;
