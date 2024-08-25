import { createServer } from "vite";
import scanner from "react-scanner";
import { fileURLToPath } from "node:url";

const crawlFrom = fileURLToPath(new URL("../armada", import.meta.url));
const scannerResults = await scanner.run(
  {
    crawlFrom,
    includeSubComponents: true,
    exclude: [
      "node_modules",
      "dist",
      "build",
      ".git",
      "tmp",
      ".circleci",
      "__testfixtures__",
    ],
    globs: ["**/!(*.test|*.spec).@(js|ts)?(x)"],
    importedFrom: "@optibus-internal/ops-designsys",
    processors: ["raw-report"],
  },
  "."
);
const server = await createServer({
  configFile: "vite.config.ts",
  define: { scannerResults, crawlFrom: { path: crawlFrom } },
  server: {
    port: 4682,
  },
});
await server.listen();

server.printUrls();
server.bindCLIShortcuts({ print: true });
