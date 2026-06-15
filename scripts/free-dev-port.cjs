const { execFileSync } = require("node:child_process");

const port = process.env.DEV_PORT || "3000";
const currentPid = process.pid;

function getWindowsPortPids() {
  const output = execFileSync("netstat", ["-ano", "-p", "tcp"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"]
  });

  return output
    .split(/\r?\n/)
    .filter((line) => line.includes(`:${port}`) && line.includes("LISTENING"))
    .map((line) => line.trim().split(/\s+/).at(-1))
    .filter(Boolean);
}

function getUnixPortPids() {
  try {
    const output = execFileSync("lsof", ["-ti", `tcp:${port}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });

    return output.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

const pids = [
  ...new Set(process.platform === "win32" ? getWindowsPortPids() : getUnixPortPids())
].filter((pid) => Number(pid) !== currentPid);

for (const pid of pids) {
  try {
    process.kill(Number(pid), "SIGKILL");
    console.log(`Port ${port} libéré: processus ${pid} arrêté.`);
  } catch {
    console.warn(`Impossible d'arrêter le processus ${pid} sur le port ${port}.`);
  }
}
