#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import process from "node:process";
import { program } from "commander";
import { createServer } from "vite";
import scanner from "react-scanner";

program
  .name("design-system-scanner")
  .description("Crawls a codebase and analyzes usage of the design system")
  .argument(
    "<crawlFrom>",
    "The path to crawl from. This should be the path to armada or houston for example"
  )
  .option("-p, --port <port>", "Port to run the server on", "4682");
program.parse();

const port = parseInt(program.opts().port);
const [relativeCrawlFrom] = program.args;

const crawlFrom = path.join(process.cwd(), relativeCrawlFrom);

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
  configFile: fileURLToPath(import.meta.resolve("./vite.config.ts")),
  define: { scannerResults, crawlFrom: { path: crawlFrom } },
  server: { port },
  root: fileURLToPath(import.meta.resolve(".")),
});
await server.listen();

server.printUrls();
server.bindCLIShortcuts({ print: true });
