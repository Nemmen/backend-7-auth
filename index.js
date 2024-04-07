const express = require('express');
const app = express();
const connectDB = require('./config/database');
require("dotenv").config();
app.use(express.json())
const userRoutes = require('./routes/userRoutes');
const port = process.env.PORT || 4000;

//what is cookie parser why we need this?? 

app.use('/api/v1', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectDB();

//middleware 
//utility function that invoke before the request is passed to the route handler ( mtlab bech mai hi incept kr kr excute...)

//first middleware to check the authenticity of the user via jwt token... than rest to authorize the user and define the protected route that can  only be asccesed by the student or by the admin