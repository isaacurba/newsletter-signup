import express from "express";
import bodyParser from "body-parser";
import path from "path";
import https from "https";  
import { fileURLToPath } from "url";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static("public"));  

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));


const appKey = "c4d4ef0fef7fd10657df3f83fb152169-us4";

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName,
            }
        }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us4.api.mailchimp.com/3.0/lists/5385fafb37";

  const options = {
    method: "POST",
    auth: "isaac:c4d4ef0fef7fd10657df3f83fb152169-us4"
  };

  const request = https.request(url, options, (response)=> {
    response.on("data", (data)=> {
      console.log(JSON.parse(data));

    if (response.statusCode === 200) {
         res.sendFile(path.join(__dirname, "success.html"));
    } else {
         res.sendFile(path.join(__dirname, "failure.html"));
      }

    });
  });

  request.write(jsonData);
  request.end();

  console.log("New Signup:");
  console.log(`Name: ${firstName} ${lastName}`);
  console.log(`Email: ${email}`);

});

app.post("/failure.html", (req, res)=> {
  res.redirect("/");
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server live at port 3000");
});
