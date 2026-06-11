"use client";

import CodeMirror from "@uiw/react-codemirror";
import { json as jsonLang } from "@codemirror/lang-json";
import { EditorView, keymap } from "@codemirror/view";
import { linter } from "@codemirror/lint";
import {
  highlightSelectionMatches,
  searchKeymap,
  openSearchPanel
} from "@codemirror/search";

type Props = {
  json: string;
  handleJsonChange: (val: string) => void;
};

// JSON linter
const jsonLinter = linter((view) => {
  const text = view.state.doc.toString();
  try {
    JSON.parse(text);
    return [];
  } catch (e: any) {
    return [
      {
        from: 0,
        to: text.length,
        severity: "error",
        message: e.message,
      },
    ];
  }
});

export default function JsonEditor({ json, handleJsonChange }: Props) {
  return (
    <div
      style={{
        height: "90vh",
        width: "28%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // ✅ important fix
        fontSize: "12px",
        borderRight: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <CodeMirror
        value={json}
        theme="dark"
        height="100%"
        width="100%"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
        }}
        extensions={[
          jsonLang(),
          EditorView.lineWrapping,
          jsonLinter,
          highlightSelectionMatches(),
          keymap.of(searchKeymap),
        ]}
        onCreateEditor={(view) => {
          // ✅ prevent SSR/hydration timing issues
          requestAnimationFrame(() => {
            openSearchPanel(view);
          });
        }}
        onChange={(value) => {
          handleJsonChange(value);
        }}
        style={{
          flex: 1, // ✅ ensures full height fill
        }}
      />
    </div>
  );
}