import { useState } from "react";
import "./App.css";
import { ComponentData, useScannerResults } from "./useScannerResults";

function App() {
  const { componentList, analysis } = useScannerResults();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  return (
    <>
      <header>
        <h1>Design System Usage Scanner</h1>
      </header>
      <main>
        <div>
          <h2>All components</h2>
          <ul>
            {componentList.map((component) => (
              <li>
                <button
                  key={component}
                  onClick={() => setSelectedComponent(component)}
                >
                  {component} ({analysis.get(component)?.instances.length})
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {selectedComponent === null ? (
            <p>Select a component from the sidebar</p>
          ) : (
            <div>
              <h2>{selectedComponent}</h2>
              <InstanceStuff component={analysis.get(selectedComponent)!} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;

function InstanceStuff({ component }: { component: ComponentData }) {
  return (
    <ul>
      {component.instances.map((instance, index) => (
        <li key={index}>{JSON.stringify(instance)}</li>
      ))}
    </ul>
  );
}
