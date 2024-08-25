import { DirectoryTree, leafCount } from "./directoryTree";
import { ComponentDataInstance } from "./useScannerResults";

export function FileTreeView({
  tree,
}: {
  tree: DirectoryTree<ComponentDataInstance>;
}) {
  return (
    <ul>
      {Object.entries(tree).map(([name, child]) => (
        <details key={name} open>
          <summary>
            {child.type === "file"
              ? name
              : `${name} (${leafCount(child.subdirectory)})`}
          </summary>
          {child.type === "file" ? (
            <ul>
              {child.content.map((instance, index) => (
                <li key={index}>
                  <a href={instance.link} title="Open in VS Code">
                    Line {instance.lineNumber}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <FileTreeView tree={child.subdirectory} />
          )}
        </details>
      ))}
    </ul>
  );
}
