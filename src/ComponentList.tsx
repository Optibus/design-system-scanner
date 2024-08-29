import {
  Header,
  Label,
  ListBox,
  ListBoxItem,
  Radio,
  RadioGroup,
  Section,
} from "react-aria-components";
import { ComponentData } from "./useScannerResults";
import { useMemo, useState } from "react";

type SortBy = "name" | "instances";

export function ComponentList({
  selectedComponent,
  setSelectedComponent,
  componentLists,
  analysis,
}: {
  selectedComponent: string | null;
  setSelectedComponent: (component: string) => void;
  componentLists: { reactComponents: string[]; icons: string[] };
  analysis: Map<string, ComponentData>;
}) {
  const [sortBy, setSortBy] = useState<SortBy>("name");

  return (
    <>
      <RadioGroup
        value={sortBy}
        onChange={(sortBy) => setSortBy(sortBy as SortBy)}
      >
        <Label>Sort by</Label>
        <Radio value="name">Name</Radio>
        <Radio value="instances">Instances</Radio>
      </RadioGroup>
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
        <ComponentListSection
          title="Components"
          id="react-components"
          components={componentLists.reactComponents}
          analysis={analysis}
          sortBy={sortBy}
        />
        <ComponentListSection
          title="Icons"
          id="icons"
          components={componentLists.icons}
          analysis={analysis}
          sortBy={sortBy}
        />
      </ListBox>
    </>
  );
}

function ComponentListSection({
  title,
  id,
  components,
  analysis,
  sortBy,
}: {
  title: string;
  id: string;
  components: string[];
  analysis: Map<string, ComponentData>;
  sortBy: SortBy;
}) {
  const sortedComponents = useMemo(
    () => sortComponentsWithCounts(components, analysis, sortBy),
    [components, analysis, sortBy]
  );

  if (sortedComponents.length === 0) {
    return null;
  }
  return (
    <Section id={id}>
      <Header>{title}</Header>
      {sortedComponents.map((component) => (
        <ListBoxItem key={component.name} id={component.name}>
          {`${component.name} (${component.instanceCount})`}
        </ListBoxItem>
      ))}
    </Section>
  );
}

function sortComponentsWithCounts(
  components: string[],
  analysis: Map<string, ComponentData>,
  sortBy: SortBy
): { name: string; instanceCount: number }[] {
  const componentsWithCounts = components.map((component) => ({
    name: component,
    instanceCount: analysis.get(component)!.instances.length,
  }));
  return sortBy === "instances"
    ? componentsWithCounts.sort((a, b) => b.instanceCount - a.instanceCount)
    : componentsWithCounts.sort((a, b) => a.name.localeCompare(b.name));
}
