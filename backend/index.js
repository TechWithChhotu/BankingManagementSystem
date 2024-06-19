import app from "./app.js";
// import mongoDbConfig from "./config/config.mongodb.js";
import { config } from "dotenv";
import { v2 } from "cloudinary";
config();

import { oracleDBConfig } from "./config/v1_config.oracle.js";
import mongoDbConfig from "./config/v1_config.mongoDB.js";

/*----------------->> Cloudinary configuration<<-----------------*/
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT || 3001;

app.listen(port, async () => {
  await oracleDBConfig();
  await mongoDbConfig();
  console.log(`App is running on http://localhost:${port}`);
});
