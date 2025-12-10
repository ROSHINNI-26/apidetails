
// Function Declaration with return type
// let userDetails=function(name ,password){
//     console.log("Hello");
//     console.log(`Name: ${name}, Password: ${password}`);
//     return{
//         name:"raja",
//         password:"raja@123"
//     };
// }
// consolelog(userDetails("Rose","rose@2006"));
// let returnValues=userDetails("Roshni","roshni@2006");
// console.log(returnValues);

//normal function

// function getUserDetails(){
//     console.log("This is normal function..")
//     return 'user detail get successfully...'
// }
// console.log(getUserDetails());
// console.log(getUserDetails());
// console.log(getUserDetails());
// console.log(getUserDetails());

// immediate invoking function
// (
//     function(username , password){
//         console.log(username,password);
//         console.log("Hey hello this is immediate function...")
//     }
// )()("admin","admin@123");                                   //this bracket is for invoking the function immediately

//arrow function
// let arrow=()=>{
//     console.log(this);
//     window.close.log("hello");
// }
// arrow()

//higher order function
// function outerFunction(){
//         let a = 10;
//         function innerFunction(){
//             console.log(a);
//         }
//         console.log("outer function called");
//         innerFunction();
//     }
// outerFunction();

//higher order fucntion with call back

// function LandingPage(reg,login){
//     console.log("Welcome to the Landing Page");
// }
// function Register(){
//     console.log("Register your account");
// }
// function Login(){
//     console.log("Login successfully")
// }
// LandingPage(Register(),Login());

// function *generatorFun(){
//     console.log("Generator fucntion");
// }
// generatorFun().next()

function *generatorFun(){
    yield a=10;
    yield b=20;
    yield c=30;
    console.log("Generator function")
}
let result=generatorFun()
console.log(result.next().value);
console.log(result.next().value);
console.log(result.next().value);
result.next()


