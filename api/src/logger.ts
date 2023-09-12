import { pino } from "pino";

// This configures the logger to match the expected format for Cloud Logging.
// See more here: https://cloud.google.com/logging/docs/structured-logging.

type Severity =
  | "DEFAULT"
  | "DEBUG"
  | "INFO"
  | "NOTICE"
  | "WARNING"
  | "ERROR"
  | "CRITICAL"
  | "ALERT"
  | "EMERGENCY";

function logLevelToSeverity(logLevel: string): Severity {
  switch (logLevel) {
    case "debug":
      return "DEBUG";
    case "trace":
      return "DEBUG";
    case "info":
      return "INFO";
    case "warn":
      return "WARNING";
    case "error":
      return "ERROR";
    case "fatal":
      return "CRITICAL";
    default:
      return "DEFAULT";
  }
}

const logger = pino({
  redact: { paths: ["pid", "hostname"], remove: true },
  timestamp: false,
  messageKey: "message",
  mixin: () => ({
    timestamp: new Date().toISOString(),
  }),
  formatters: {
    level(label) {
      return { severity: logLevelToSeverity(label) };
    },
  },
});

export default logger;
