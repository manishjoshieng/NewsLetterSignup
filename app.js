const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const list_id = "e054c5f502";
const apiId = "f11e7535d2e61cc41c684da9ed5127c7-us12";
const serverId = "us12";
const mailchipUrl = "https://"+serverId+".api.mailchimp.com/3.0/lists/"+list_id;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.listen(process.env.PORT || 3000, function(){
    console.log("server started on port 3000");
})

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    console.log("post request received");
    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;

    const data = {
        members : [
            {
                email_address: email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
   
    const option = {
        method: "POST",
        auth  : "manish:"+apiId
    }

    const result = https.request(mailchipUrl,option,function(responce){
        console.log("post request completed");
        const statusCode = Number(responce.statusCode);
        console.log(statusCode);
        if (statusCode == 200) {
            responce.on("data",(data)=>{
                const jData = JSON.parse(data);
                console.log(jData);
                var error_count = Number(jData.error_count);
                console.log("Error_count: "+error_count);
                if (error_count == 0){
                    res.sendFile(__dirname+"/success.html");
                } else {
                    res.sendFile(__dirname+"/fail.html");
                }    
            });
        }
        
    });
   
    result.write(jsonData);
    result.end();
});

app.post("/fail",function(req,res){
    res.redirect("/");
})


//API key
//f11e7535d2e61cc41c684da9ed5127c7-us12

//audienceId
//e054c5f502