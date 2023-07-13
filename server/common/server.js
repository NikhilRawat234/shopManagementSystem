import express from "express";
import mongoose from "mongoose";
import * as http from "http"
import * as path from "path"
const root = path.normalize(`${__dirname}/../..`);
import cors from "cors";
import morgan from "morgan";
// import swaggerJSDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
import apiErrorHandler from "../helper/apiErrorHandler";
const app = express();


class ExpressServer {
  constructor() {
    this.app = express(); // Initialize the app first

    this.app.use(express.json({ limit: '1000mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '1000mb' })); 
    this.app.use(morgan('dev'));

    this.app.use(
      cors({
        allowedHeaders: ["Content-Type", "token", "authorization"],
        exposedHeaders: ["token", "authorization"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
      })
    );
  }

//   configureSwagger(swaggerDefinition) {
//     const options = {
//       // swaggerOptions : { authAction :{JWT :{name:"JWT", schema :{ type:"apiKey", in:"header", name:"Authorization", description:""}, value:"Bearer <JWT>"}}},
//       swaggerDefinition,
//       apis: [
//         path.resolve(`${root}/server/api/v1/controller/**/*.js`),
//         path.resolve(`${root}/api.yaml`),
//       ],
//     };

//     this.app.use(
//       "/api-docs",
//       swaggerUi.serve,
//       swaggerUi.setup(swaggerJSDoc(options))
//     );
//     return this;
//   }
handleError() {
  this.app.use(apiErrorHandler);
  return this;
}
  configureDB(dbUrl) {
    return mongoose
      .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("MongoDB connection established");
        return this;
      })
      .catch((err) => {
        console.log(`Error in MongoDB connection: ${err.message}`);
        throw err;
      });
  }

  router(routes) {
    this.app.use(routes);
    return this;
  }

  listen(port) {
    this.app.listen(port, () => {
      console.log(`Secure app is listening on port ${port}`);
    });
    return this;
  }
}

export default ExpressServer;


