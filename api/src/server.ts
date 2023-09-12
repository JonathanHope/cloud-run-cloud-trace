import logger from "./logger";
import provider from "./tracer";
import Fastify from "fastify";
import cors from "@fastify/cors";
import openTelemetryPlugin from "@autotelic/fastify-opentelemetry";

export default async function serverFactory() {
  const server = Fastify({
    logger,
    disableRequestLogging: true,
  });

  await server.register(cors, {
    origin: true,
  });

  // This integrates otel with Fastify.
  await server.register(openTelemetryPlugin, {
    wrapRoutes: true,
  });

  // This is intended to be run in Cloud Run.
  // All of the traces need to be written before the response is returned.
  // We can't trust that the instance is around anymore once the response is returned.
  server.addHook("onResponse", async () => {
    try {
      await provider.forceFlush();
    } catch (e) {
      logger.warn(e);
    }
  });

  return server;
}
