import { useId, useState } from "react";
import "./App.css";
import { ComponentData, useScannerResults } from "./useScannerResults";
import { makeDirectoryTree } from "./directoryTree";
import { FileTreeView } from "./FileTreeView";
import { PropsView } from "./PropsView";
import { analyzePropUsage } from "./propUsage";
import {
  ListBox,
  ListBoxItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "react-aria-components";

function App() {
  const { componentList, analysis } = useScannerResults();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  return (
    <>
      <header>
        <h1>Design System Scanner</h1>
      </header>
      <aside>
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
      </aside>
      {componentList.length > 0 && (
        <main>
          {selectedComponent === null ? (
            <p>Select a component from the sidebar</p>
          ) : (
            <>
              <h2>{selectedComponent}</h2>
              <InstanceStuff component={analysis.get(selectedComponent)!} />
            </>
          )}
        </main>
      )}
    </>
  );
}

export default App;

function InstanceStuff({ component }: { component: ComponentData }) {
  const filesTabId = useId();
  const propsTabId = useId();
  return (
    <Tabs>
      <TabList aria-label="History of Ancient Rome">
        <Tab id={filesTabId}>Files</Tab>
        <Tab id={propsTabId}>Props</Tab>
      </TabList>
      <TabPanel id={filesTabId}>
        <FileTreeView
          tree={makeDirectoryTree(
            component.instances,
            (instance) => instance.relativePath
          )}
        />
      </TabPanel>
      <TabPanel id={propsTabId}>
        <PropsView propUsage={analyzePropUsage(component.instances)} />
      </TabPanel>
    </Tabs>
  );
}
