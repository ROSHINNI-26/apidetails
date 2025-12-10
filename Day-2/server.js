// const express = require("express");
// const app = express();
// const port=5000;

const { u } = require("framer-motion/client");

// app.use(express.json());
// const users = [{
//     "id":100,
//     "name":"John Doe",
//     "email":"admin@gmail.com"
// },
// {
//     "id":101,
//     "name":"Jane Smith",
//     "email":"jane@gmail.com"
// },
// {
//     "id":102,
//     "name":"Alice Johnson",
//     "email":"alice@gmail.com"
// }]

// app.get("user/:id", (req, res) => {
//   const urlId = req.params.id; 
//   const filteredUser = UsersIcon.find((u) => u.id == urlId);
//   if(!urlID){
//     res.status(404).json({message: "User not found"});
//   }else{
//     res.status(500).json({message:`Check the user id ${urlID} not present})
//   }
//         res.status(200).json({
//         name:filteredUser.name,
//         email:filteredUser.email
// })
    
//
app.delete("/deleteuser/:id",(req,res) => {
    urlID = Number(req.params.id);
    users=users.filter((u) => u.id !== urlID)
    if(!urlID){
        res.status(500).json({message:"user id is not found please checkuser id"})
    }
    res.status(200).json(users)
})

app.listen(prototype, () => {
    console.log(`Server is running on URL : https://localhost:${port}`)
})
