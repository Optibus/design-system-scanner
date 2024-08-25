export type DirectoryTree<T> = Record<string, DirectoryTreeChild<T>>;
export type DirectoryTreeChild<T> =
  | {
      type: "subdirectory";
      subdirectory: DirectoryTree<T>;
    }
  | { type: "file"; content: T[] };

export function makeDirectoryTree<T>(
  elements: T[],
  filePath: (file: T) => string
) {
  const longTree = makeLongDirectoryTree(elements, filePath);
  return concatenateTree(longTree);
}

function concatenateTree<T>(tree: DirectoryTree<T>): DirectoryTree<T> {
  const newTree: DirectoryTree<T> = {};
  for (const [name, child] of Object.entries(tree)) {
    const newChild = concatenateChild(name, child);
    newTree[newChild.name] = newChild.child;
  }

  return newTree;
}

function concatenateChild<T>(
  name: string,
  child: DirectoryTreeChild<T>
): { name: string; child: DirectoryTreeChild<T> } {
  if (child.type === "file") {
    return { name, child };
  } else {
    const grandchildren = Object.entries(child.subdirectory);
    if (grandchildren.length === 1) {
      const [grandchildName, grandchild] = grandchildren[0];
      const newGrandchild = concatenateChild(
        `${name}/${grandchildName}`,
        grandchild
      );
      return newGrandchild;
    } else {
      return {
        name,
        child: {
          type: "subdirectory",
          subdirectory: Object.fromEntries(
            grandchildren.map(([name, child]) => {
              const newChild = concatenateChild(name, child);
              return [newChild.name, newChild.child];
            })
          ),
        },
      };
    }
  }
}

function makeLongDirectoryTree<T>(
  elements: T[],
  filePath: (file: T) => string
): DirectoryTree<T> {
  const tree: DirectoryTree<T> = {};
  for (const element of elements) {
    const pathParts = filePath(element).split("/");
    let current: DirectoryTree<T> = tree;
    pathParts.forEach((part, index) => {
      if (current[part]) {
        if (current[part].type === "file") {
          current[part].content.push(element);
          // This should be the last part
          if (index !== pathParts.length - 1) {
            throw new Error(
              "Impossible state: a file is not the last part of the path"
            );
          }
          return;
        } else {
          current = current[part].subdirectory;
        }
      } else {
        if (index === pathParts.length - 1) {
          current[part] = { type: "file", content: [element] };
          // This should be the last part
          if (index !== pathParts.length - 1) {
            throw new Error(
              "Impossible state: a file is not the last part of the path"
            );
          }
          return;
        } else {
          const newDirectory: DirectoryTreeChild<T> = {
            type: "subdirectory",
            subdirectory: {},
          };
          current[part] = newDirectory;
          current = newDirectory.subdirectory;
        }
      }
    });
  }
  return tree;
}

export function leafCount<T>(tree: DirectoryTree<T>): number {
  let count = 0;
  for (const child of Object.values(tree)) {
    if (child.type === "file") {
      count += child.content.length;
    } else {
      count += leafCount(child.subdirectory);
    }
  }
  return count;
}
