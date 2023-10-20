const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const route = require('./routes/index')


app.use(express.json());
app.use(bodyParser.json());


route(app)




const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});

