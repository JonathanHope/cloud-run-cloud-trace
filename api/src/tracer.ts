// The import ordering is the way it is because of this bug:
// https://github.com/open-telemetry/opentelemetry-js/issues/3796

import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
const httpInstrumentation = new HttpInstrumentation();

import logger from "./logger";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  AlwaysOnSampler,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";

export const provider = new NodeTracerProvider({
  sampler: new AlwaysOnSampler(),
});

// Enabe this to export the spans to a sidecar collector image.
if (process.env.PROD_TRACE_EXPORT) {
  logger.info("Tracing configured for prod export.");
  provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
}

// Enabe this to see the traces printed to console.
if (process.env.DEBUG_TRACE_EXPORT) {
  logger.info("Tracing configured for debug export.");
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

provider.register();

registerInstrumentations({
  instrumentations: [httpInstrumentation],
});

export default provider;
