import "dotenv/config";
import "./tracer";
import serverFactory from "./server";

async function main() {
  const server = await serverFactory();

  server.get("/health", async () => "Healthy");

  await server.listen({
    host: "0.0.0.0",
    port: 8080,
  });
}

main();
