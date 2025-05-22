const express = require('express');
const path = require('path')
const app = express();
const userModel = require('./models/user');

app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'))); 

app.get ("/" , function(req,res){
    // res.send("hello");
    res.render("index");
})

app.get ("/read" ,async function(req,res){
    let users= await userModel.find();
    res.render("read" ,{users});
})
app.get("/edit/:userid", async function(req, res) {
    let user = await userModel.findOne({ _id: req.params.userid });
    res.render("edit", { user });
});

app.post("/update/:userid", async function(req, res) {
    let { name, email, image } = req.body; // Extract new values from the request body
    let user = await userModel.findOneAndUpdate(
        { _id: req.params.userid }, // Find the user by their ID
        { name, email, image }, // Update the user's details
        { new: true } // Return the updated document
    );
    res.redirect("/read"); 
});



app.get ("/delete/:id" ,async function(req,res){
    let users = await userModel.findOneAndDelete({ _id: req.params.id });    
    res.redirect("/read");
});
app.post("/create", async function(req, res) {
    let { name, email, image } = req.body;
    let createdUser = await userModel.create({
        name,
        email,
        image
    });

    // Redirect to the /read route to show the updated list of users
    res.redirect("/read");
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
