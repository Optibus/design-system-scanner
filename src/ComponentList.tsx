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
  componentList,
  analysis,
}: {
  selectedComponent: string | null;
  setSelectedComponent: (component: string) => void;
  componentList: string[];
  analysis: Map<string, ComponentData>;
}) {
  const [sortBy, setSortBy] = useState<SortBy>("name");

  const componentSections = useMemo(() => {
    const componentsWithCounts = componentList.map((component) => ({
      name: component,
      instanceCount: analysis.get(component)!.instances.length,
    }));
    const sortedComponentsWithCounts =
      sortBy === "instances"
        ? componentsWithCounts.sort((a, b) => b.instanceCount - a.instanceCount)
        : componentsWithCounts.sort((a, b) => a.name.localeCompare(b.name));

    const reactComponents = [];
    const icons = [];
    for (const component of sortedComponentsWithCounts) {
      if (/(Small|Medium|Large|Custom)$/.test(component.name)) {
        icons.push(component);
      } else {
        reactComponents.push(component);
      }
    }
    return { reactComponents, icons };
  }, [componentList, sortBy, analysis]);

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
        <Section id="react-components">
          <Header>Components</Header>
          {componentSections.reactComponents.map((component) => (
            <ListBoxItem key={component.name} id={component.name}>
              {`${component.name} (${component.instanceCount})`}
            </ListBoxItem>
          ))}
        </Section>
        <Section id="icons">
          <Header>Icons</Header>
          {componentSections.icons.map((component) => (
            <ListBoxItem key={component.name} id={component.name}>
              {`${component.name} (${component.instanceCount})`}
            </ListBoxItem>
          ))}
        </Section>
      </ListBox>
    </>
  );
}
