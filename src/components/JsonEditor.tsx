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
        maxHeight: "90vh",
        width: "28%",
        display: "flex",
        overflow: "auto",
        fontSize: "12px",
      }}
    >
      <CodeMirror
        value={json}
        height="100%"
        width="100%"
        theme="dark"
        spellCheck={true}
        extensions={[
          jsonLang(),
          EditorView.lineWrapping,
          jsonLinter,
          highlightSelectionMatches(),
          keymap.of(searchKeymap),
        ]}
        onCreateEditor={(view) => {
          setTimeout(() => {
            openSearchPanel(view);
          }, 0);
        }}
        onChange={(value) => {
          handleJsonChange(value);
        }}
      />
    </div>
  );
}