import { ListBox, ListBoxItem } from "react-aria-components";
import { ComponentData } from "./useScannerResults";

export function ComponentList({
  selectedComponent,
  setSelectedComponent,
  componentList,
  analysis,
}: {
  selectedComponent: string | null;
  setSelectedComponent: (component: string) => void;
  componentList: string[];
  analysis: Map<string, ComponentData>;
}) {
  return (
    <ListBox
      renderEmptyState={() => (
        <p style={{ padding: "1rem" }}>
          No design system components found in this project.
        </p>
      )}
      aria-label="All Components"
      selectionMode="single"
      selectionBehavior="replace"
      selectedKeys={selectedComponent === null ? [] : [selectedComponent]}
      onSelectionChange={(selection) => {
        if (selection === "all" || selection.size === 0) {
          return;
        }
        setSelectedComponent(selection.values().next().value);
      }}
    >
      {componentList.map((component) => (
        <ListBoxItem key={component} id={component}>
          {`${component} (${analysis.get(component)?.instances.length})`}
        </ListBoxItem>
      ))}
    </ListBox>
  );
}
