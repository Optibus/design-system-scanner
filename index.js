#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import process from "node:process";
import { program } from "commander";
import { build, createServer } from "vite";
import scanner from "react-scanner";
import open from "open";

program
  .name("design-system-scanner")
  .description("Crawls a codebase and analyzes usage of the design system")
  .argument(
    "<crawlFrom>",
    "The path to crawl from. This should be the path to armada or houston for example"
  )
  .option(
    "-s, --server",
    "Start a Vite dev server to work on the package's code"
  );
program.parse();

const { server = false } = program.opts();
const [relativeCrawlFrom] = program.args;

const crawlFrom = path.join(process.cwd(), relativeCrawlFrom);

const scannerResults = await scanner.run(
  {
    crawlFrom,
    includeSubComponents: true,
    exclude: [
      "node_modules",
      "bower_components",
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

const config = {
  configFile: fileURLToPath(import.meta.resolve("./vite.config.ts")),
  define: { scannerResults, crawlFrom: { path: crawlFrom } },
  server: { port: 4682 },
  root: fileURLToPath(import.meta.resolve(".")),
  build: {
    outDir: "scanner-report",
  },
};

if (server) {
  const server = await createServer(config);
  await server.listen();
  server.printUrls();
  server.bindCLIShortcuts({ print: true });
} else {
  await build(config);
  open(fileURLToPath(import.meta.resolve("./scanner-report/index.html")));
}
