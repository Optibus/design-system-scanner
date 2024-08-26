import { useId } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { makeDirectoryTree } from "./directoryTree";
import { FileTreeView } from "./FileTreeView";
import { PropsView } from "./PropsView";
import { analyzePropUsage } from "./propUsage";
import { ComponentData } from "./useScannerResults";

export function ComponentReport({
  title,
  component,
}: {
  title: string;
  component: ComponentData;
}) {
  const filesTabId = useId();
  const propsTabId = useId();
  return (
    <>
      <h2>{title}</h2>

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
    </>
  );
}
