import { useState } from "react";

type Props = {
  data: any;
};

function TreeNode({ name, value }: { name?: string; value: any }) {
  const [collapsed, setCollapsed] = useState(name ? true : false);

  const isObject = typeof value === "object" && value !== null;
  const isArray = Array.isArray(value);

  if (!isObject) {
    return (
      <div style={{ paddingLeft: "12px", color: "#9cdcfe" }}>
        {name && <span style={{ color: "#4fc3f7" }}>{name}: </span>}
        <span>{JSON.stringify(value)}</span>
      </div>
    );
  }

  const keys = Object.keys(value);
  const count = keys.length;

  return (
    <div style={{ paddingLeft: "12px" }}>
      <div
        style={{
          cursor: "pointer",
          color: "#dcdcaa",
          userSelect: "none",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span style={{ marginRight: "6px" }}>
          {collapsed ? "▶" : "▼"}
        </span>

        {name && <span style={{ color: "#4fc3f7" }}>{name}: </span>}

        <span style={{ color: "#ce9178" }}>
          {isArray ? `[${count}]` : `{${count}}`}
        </span>
      </div>

      {!collapsed && (
        <div>
          {keys.map((key) => (
            <TreeNode key={key} name={key} value={value[key]} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JsonTree({ data }: Props) {
  if (!data) {
    return (
      <div
        style={{
          height: "90vh",
          width: "28%",
          background: "#1e1e1e",
          color: "#888",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
        }}
      >
        Invalid JSON
      </div>
    );
  }

  return (
    <div
      style={{
        height: "90vh",
        maxHeight: "90vh",
        width: "28%",
        overflow: "auto",
        background: "#1e1e1e",
        color: "#d4d4d4",
        fontSize: "12px",
        padding: "8px",
        fontFamily: "monospace",
      }}
    >
      <TreeNode value={data} />
    </div>
  );
}