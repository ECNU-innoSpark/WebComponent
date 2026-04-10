import { createServer } from "node:net";

export async function findAvailablePort(preferredPort) {
  let port = preferredPort;

  while (!(await isPortAvailable(port))) {
    port += 1;
  }

  return port;
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

export function readPort(value, fallbackPort) {
  const port = Number.parseInt(value ?? "", 10);
  return Number.isInteger(port) && port > 0 ? port : fallbackPort;
}
