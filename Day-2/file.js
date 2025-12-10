const fs=require("fs")
fs.writeFile("sample.txt","I created new file using fs module...",(err)=>{
    console.log(err);
    console.log("File created successfully");
});
fs.appendFile("sample.txt","hi...",(err)=>{
    console.log(err);
});
fs.unlink("index.txt",(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("File deleted successfully");
    }
})