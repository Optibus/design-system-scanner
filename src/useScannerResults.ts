import { useMemo } from "react";

type ScannerResultInstance = {
  importInfo: {
    imported: string;
    local: string;
    moduleName: string;
    importType: string;
  };
  props: Record<string, string | boolean>;
  propsSpread: boolean;
  location: {
    file: string;
    start: {
      line: number;
      column: number;
    };
  };
};

declare global {
  interface Window {
    scannerResults: Record<string, { instances: ScannerResultInstance[] }>;
    crawlFrom: { path: string };
  }
}

export type ComponentDataInstance = {
  relativePath: string;
  lineNumber: number;
  link: string;
  props: Record<string, string | boolean>;
  propsSpread: boolean;
};

export type ComponentData = {
  hasSpread: boolean;
  instances: ComponentDataInstance[];
};

function parseScannerComponentResult(scanResult: {
  instances: ScannerResultInstance[];
}): ComponentData {
  const hasSpread = scanResult.instances.some(
    (instance) => instance.propsSpread
  );
  const instances = scanResult.instances.map((instance) => ({
    relativePath: instance.location.file.replace(
      window.crawlFrom.path + "/",
      ""
    ),
    lineNumber: instance.location.start.line,
    link: `vscode://file/${instance.location.file}:${instance.location.start.line}:${instance.location.start.column}`,
    props: instance.props,
    propsSpread: instance.propsSpread,
  }));
  return { instances, hasSpread };
}

export function useScannerResults(): {
  componentList: string[];
  analysis: Map<string, ComponentData>;
} {
  const componentList = useMemo(
    () => Object.keys(window.scannerResults).sort(),
    []
  );
  const analysis = useMemo(
    () =>
      new Map(
        Object.entries(window.scannerResults).map(([component, result]) => [
          component,
          parseScannerComponentResult(result),
        ])
      ),
    []
  );

  return { componentList, analysis };
}
