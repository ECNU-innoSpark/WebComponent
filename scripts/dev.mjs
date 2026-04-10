import { spawn } from "node:child_process";
import { findAvailablePort, readPort } from "./port-utils.mjs";

const preferredPort = readPort(process.env.AI_WEB_COMPONENT_PORT, 5173);
const resolvedPort = await findAvailablePort(preferredPort);

if (resolvedPort !== preferredPort) {
  process.stdout.write(`[dev] Port ${preferredPort} is busy, using ${resolvedPort} instead.\n`);
}

const child = spawn("pnpm", ["exec", "vite", "--port", String(resolvedPort)], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    AI_WEB_COMPONENT_PORT: String(resolvedPort)
  },
  shell: process.platform === "win32",
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
