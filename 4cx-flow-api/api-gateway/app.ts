import express, { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app: Application = express();

const routes = {
  "/main": "http://4cx-main:9002",
  "/flow": "http://4cx-flow:3000",
};

for (const route in routes) {
  const target = routes[route];
  app.use(route, createProxyMiddleware({ target }));
}


app.listen(8000, () => console.log("API Gateway Started on port 8000"));
