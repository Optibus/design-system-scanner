import { useState } from "react";
import "./App.css";
import { useScannerResults } from "./useScannerResults";
import { ComponentList } from "./ComponentList";
import { ComponentReport } from "./ComponentReport";

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
        <ComponentList
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          componentList={componentList}
          analysis={analysis}
        />
      </aside>
      {componentList.length > 0 && (
        <main>
          {selectedComponent === null ? (
            <p>Select a component from the sidebar</p>
            <div className="placeholder">
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
