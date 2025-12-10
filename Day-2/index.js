const express = require('express');
const app = express();

const jwt=require('jsonwebtoken');
const secretKey='PL9nQLQLWxq_jrA2pKRxkgIlf4NZ7C6ZI2tLhNSWLbAZMGnbtfClhkCpzPc-oTmAAe-O3kebeeLeYjzfFf9OXvQ4UDf-TRo8';

const port = 3000;
app.use(express.json());//since we are sending in json format 


const users=[
    {id:1, name:'Alice',email:'alice@example.com'},
    {id:2, name:'Bob',email:'bob@example.com'},
    {id:3, name:'Charlie',email:'charlie@example.com'}
];


app.get('/login',(req,res)=>{
    const user={
        id:1,
        username:'Ram',
        role:'admin'
    };
    const token=jwt.sign({user}, secretKey, {expiresIn:'50s'});
    res.status(201).json({generatedtoken:token});
});


app.get("/profile",(req,res)=>{
    const token=req.headers['authorization'];
    const verified=jwt.verify(token,secretKey);
    if (verified instanceof jwt.TokenExpiredError){
        res.status(401).res.json({message:"Token expired", verified});
    } else if(verified instanceof jwt.TokenExpiredError){ 
        res.status(401).json({message:"Invalid Token"});
    }
    else{
        res.status(200).json({message:"Access granted to protected profile", verified});
    }
});

// app.get('/profile', (req, res) => {
//   // Read authorization from header or cookie/body if you use them
//   const authHeader = req.headers['authorization'] || req.headers['Authorization'] || null;
//   if (!authHeader) {
//     return res.status(401).json({ error: 'No Authorization header provided' });
//   }

//   // If header is "Bearer <token>" remove "Bearer "
//   const token = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
//     ? authHeader.slice(7).trim()
//     : authHeader.trim();

//   if (!token) {
//     return res.status(401).json({ error: 'Token malformed or missing' });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] }); // algorithms optional
//     // success
//     return res.status(200).json({
//       message: 'Access granted to protected profile',
//       verified: decoded
//     });
//   } catch (err) {
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token expired', error: err.message });
//     }
//     // invalid token / signature / malformed
//     return res.status(401).json({ message: 'Invalid token', error: err.message });
//   }
// });

app.get('/users', (req, res) => {
    res.json(users);
});


app.post('/newUser', (req, res) => {
    const newUser = {
        id:req.body.id,
        name:req.body.name,
        email:req.body.email
    };
    users.push(newUser);
    res.status(201).json({"message":"User added successfully", user:newUser});
});


app.get('/getusers/:id', (req, res) => {
    const urlID = Number(req.params.id);
    const filteredUser = users.find(user => user.id === urlID);
    if(filteredUser){
        res.json(filteredUser);
    } else {
        res.status(404).json({"message":"User not found"});
    }   
});  


app.delete('/deleteusers/:id', (req, res) => {
    const urlID = Number(req.params.id);
   const  updatesuser=users.filter(user => user.id !== urlID);
    res.send(updatesuser);  
});


//delete all users at a time
app.delete('/deleteallusers', (req, res) => {
    users.length = 0;   
    res.json({"message":"All users have been deleted"});
    res.send(users);
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});