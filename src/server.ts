import express, { type Express, type Router } from "express";

interface ServerOptions {
  port: number;
  routes: Router;
}

export class Server {
  private readonly app: Express;
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    this.app = express();
    this.port = options.port;
    this.routes = options.routes;
  }

  public start = (): void => {
    // Activa express.json() antes de registrar las rutas
    this.app.use(express.json());

    // Prefijo base /api
    this.app.use("/api", this.routes);

    this.app.listen(this.port, () => {
      console.log(`Servidor escuchando en http://localhost:${this.port}`);
    });
  };
}

