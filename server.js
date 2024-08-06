import { createServer } from "vite";
import scanner from "react-scanner";

const scannerResults = await scanner.run(
  {
    crawlFrom: "../armada/calendar",
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
  // root: ".",
  configFile: "vite.config.ts",
  define: { scannerResults },
  server: {
    port: 1337,
  },
});
await server.listen();

server.printUrls();
server.bindCLIShortcuts({ print: true });
