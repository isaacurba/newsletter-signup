import express from "express";
import bodyParser from "body-parser";
import path from "path";
import https from "https";
import { fileURLToPath } from "url"; // ✅ correct import
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ⛳ Resolving __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static files
app.use(express.static("public"));

// Form data
app.use(bodyParser.urlencoded({ extended: true }));

// Load from .env
const appKey = process.env.MAILCHIMP_API_KEY;
const listID = process.env.MAILCHIMP_LIST_ID;

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.post("/", (req, res) => {
  const { firstName, lastName, email } = req.body;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = `https://us4.api.mailchimp.com/3.0/lists/${listID}`;

  const options = {
    method: "POST",
    auth: `anystring:${appKey}` // ✅ use any string before :
  };

  const request = https.request(url, options, (response) => {
    let responseData = "";

    response.on("data", (chunk) => {
      responseData += chunk;
    });

    response.on("end", () => {
      const parsedData = JSON.parse(responseData);
      console.log(parsedData);

      if (response.statusCode === 200 && !parsedData.errors?.length) {
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

app.post("/failure.html", (req, res) => {
  res.redirect("/");
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server live at port 3000");
});
