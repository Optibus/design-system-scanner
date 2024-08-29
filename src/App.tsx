import { useState } from "react";
import "./App.css";
import { useScannerResults } from "./useScannerResults";
import { ComponentList } from "./ComponentList";
import { ComponentReport } from "./ComponentReport";
import { sumBy } from "./utils";

function App() {
  const { componentLists, analysis } = useScannerResults();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const stats = {
    componentCount: componentLists.reactComponents.length,
    iconCount: componentLists.icons.length,
    componentInstanceCount: sumBy(
      componentLists.reactComponents,
      (component) => analysis.get(component)!.instances.length
    ),
    iconInstanceCount: sumBy(
      componentLists.icons,
      (component) => analysis.get(component)!.instances.length
    ),
  };

  return (
    <>
      <header>
        <h1>Design System Scanner</h1>
      </header>
      <aside>
        <ComponentList
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          componentLists={componentLists}
          analysis={analysis}
        />
      </aside>
      {stats.componentCount + stats.iconCount > 0 && (
        <main>
          {selectedComponent === null ? (
            <div className="placeholder">
              <p>
                There are {stats.componentCount} components used{" "}
                {stats.componentInstanceCount} times and {stats.iconCount} icons
                used {stats.iconInstanceCount} times in this project.
              </p>
              <p>Select a component from the sidebar to see more details.</p>
            </div>
          ) : (
            <>
              <ComponentReport
                title={selectedComponent}
                component={analysis.get(selectedComponent)!}
              />
            </>
          )}
        </main>
      )}
    </>
  );
}

export default App;
