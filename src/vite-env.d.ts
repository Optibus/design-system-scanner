/// <reference types="vite/client" />

declare const scannerResults: Record<
  string,
  { instances: ScannerResultInstance[] }
>;
declare const crawlFrom: { path: string };
