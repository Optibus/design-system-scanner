import { ComponentDataInstance } from "./useScannerResults";

export type PropUsage = {
  propInstances: Record<string, Record<string, ComponentDataInstance[]>>;
  spreads: ComponentDataInstance[];
};

export function analyzePropUsage(
  instances: ComponentDataInstance[]
): PropUsage {
  const propInstances: Record<
    string,
    Record<string, ComponentDataInstance[]>
  > = {};
  const spreads: ComponentDataInstance[] = [];
  for (const instance of instances) {
    if (instance.propsSpread) {
      spreads.push(instance);
    }
    for (const [propName, propValue] of Object.entries(instance.props)) {
      const stringPropValue = JSON.stringify(propValue);
      if (!propInstances[propName]) {
        propInstances[propName] = {};
      }
      if (!propInstances[propName][stringPropValue]) {
        propInstances[propName][stringPropValue] = [];
      }
      propInstances[propName][stringPropValue].push(instance);
    }
  }
  return { propInstances, spreads };
}
