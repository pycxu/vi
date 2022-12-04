const express = require("express");
const fs = require("fs");
var https = require("https");
const app = express();
const bodyParser = require("body-parser");
var path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();

var username = process.env.USERNAME;
var password = process.env.PASSWORD;
var key = process.env.KEY;
var cert = process.env.CERT;

var payload = JSON.stringify({
  requestHeader: {
    requestMessageId: "6da6b8b024532a2e0eacb1af58581",
    messageDateTime: "2019-02-35 05:25:12.327",
  },
  requestData: {
    pANs: [4072208010000000],
    group: "STANDARD",
  },
});

app.get("/", (req, res) => {
  var options = {
    hostname: "sandbox.api.visa.com",
    port: 443,
    uri: "https://sandbox.api.visa.com/cofds-web/v1/datainfo",
    method: "POST",
    key: fs.readFileSync(key),
    cert: fs.readFileSync(cert),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
    json: true,
  };

  options.agent = new https.Agent(options);

  var req = https.request(options, function (res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on("data", function (d) {
      process.stdout.write(d);
    });
  });

  req.write(payload);
  req.end();

  req.on("error", function (e) {
    console.error(e);
  });

  res.send("Card Authentication");
});

app.listen(3050, function () {
  console.log("Example app listening on port 3050.");
});
