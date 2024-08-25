import { useMemo } from "react";
import { countInstances, PropUsage } from "./propUsage";

export function PropsView({
  propUsage: { spreads, propInstances },
}: {
  propUsage: PropUsage;
}) {
  const instancesWithCounts = useMemo(
    () =>
      Object.entries(propInstances)
        .map(([propName, propValues]) => ({
          propName,
          propValues,
          instanceCount: countInstances(propValues),
        }))
        .sort((a, b) => b.instanceCount - a.instanceCount),
    [propInstances]
  );
  return (
    <ul>
      <details open>
        <summary>Prop spreads ({spreads.length})</summary>
        {spreads.length === 0 ? (
          <span>
            This component ins't being used with a spread (
            <code>{"{...props}"}</code>)
          </span>
        ) : (
          <ul>
            {spreads.map((instance, index) => (
              <li key={index}>
                <a href={instance.link} title="Open in VS Code">
                  {instance.relativePath}
                </a>
              </li>
            ))}
          </ul>
        )}
      </details>
      <br />
      {instancesWithCounts.length === 0 ? (
        <p>This component is only being used with its default props</p>
      ) : (
        instancesWithCounts.map(({ propName, propValues, instanceCount }) => (
          <details>
            <summary>
              {propName} ({instanceCount})
            </summary>
            <ul>
              {Object.entries(propValues).map(([propValue, instances]) => (
                <details>
                  <summary>
                    {propValue} ({instances.length})
                  </summary>
                  <ul>
                    {instances.map((instance, index) => (
                      <li key={index}>
                        <a href={instance.link} title="Open in VS Code">
                          {instance.relativePath}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </ul>
          </details>
        ))
      )}
    </ul>
  );
}
