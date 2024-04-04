import {
  registerForEvent
} from "./chunk-RCDG53FW.mjs";
import {
  errorHandler
} from "./chunk-ACQHDYYU.mjs";
import {
  checkIn
} from "./chunk-4VIS4J63.mjs";
import {
  createEvent
} from "./chunk-3BERQDRW.mjs";
import "./chunk-677O5SV4.mjs";
import {
  getAttendeeBadge
} from "./chunk-FR3NSCXF.mjs";
import {
  getEventAttendees
} from "./chunk-KXY33H2X.mjs";
import {
  getEvent
} from "./chunk-6DL2PXNP.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-5KVQPZKD.mjs";

// src/server.ts
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda durante o NLW Unite da Rockeseat.",
      version: "1/"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Server is running on port 3333");
});
