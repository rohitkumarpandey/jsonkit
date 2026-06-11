import { useState } from "react";
import { dummyJson } from "./components/dummy";
import JsonEditor from "./components/JsonEditor";
import JsonTree from "./components/JsonTree";
import JsonGraph from "./components/JsonGraph";

function App() {
  const [json, setJson] = useState(JSON.stringify(dummyJson, null, 2));

  let parsed = null;
  try {
    parsed = JSON.parse(json);
  } catch {}

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <JsonEditor json={json} handleJsonChange={setJson} />
      <JsonTree data={parsed} />
      <JsonGraph data={parsed} />
    </div>
  );
}

export default App;