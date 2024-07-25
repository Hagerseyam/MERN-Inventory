const allowedOrigins = require("./allowedOrgins")


const corsOptions = {
    orgin: (origin , callback) =>{
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true);}
     else{
        callback(new Error("Not allowed by CORS"));

    }
},
Credentials: true,
optionsSuccessStatus: 200,


}


module.exports = corsOptions;

