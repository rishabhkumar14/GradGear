const express = require('express');
const cors = require('cors');

require('dotenv').config();
// require("./config.js") // for ragbot maybe

const routers = require("./router.js");
const { response_formatter } = require("./json_formatter.js")
const { exception_handler } = require("./expection_handler.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use(response_formatter)

app.use('/api', routers);

app.use(exception_handler);

app.listen(process.env.PORT, () => {
	console.log('Process running in port:'+ process.env.PORT);
})