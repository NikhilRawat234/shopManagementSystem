import Config from "config";
import Routes from "./routes";
import ExpressServer from "./common/server";

const dbUrl = `mongodb://${Config.get("databaseHost")}:${Config.get(
  "databasePort"
)}/${Config.get("databaseName")}`;

const server = new ExpressServer()
  .router(Routes)
//   .configureSwagger(Config.get("swaggerDefinition"))
  .handleError()
  .configureDB(dbUrl)
  .then((_server) => _server.listen(Config.get("port")));

export default server;
