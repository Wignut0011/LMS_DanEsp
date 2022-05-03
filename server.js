const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const ServerErrorHandle = require("./routes/Teams/Error.handle");
const app = express()
const port = 8080;

app.use(express.static('public'))
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./routes/Teams/Team.routes')(app)
app.use(ServerErrorHandle); //Error Handler, uses catch next() method

app.listen(port,()=>console.log("Starting on port "+port));