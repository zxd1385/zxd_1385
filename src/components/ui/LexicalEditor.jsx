// components/LexicalEditor.jsx
import React, { useEffect } from "react";
import { LexicalComposer } from "../@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, $getSelection } from "lexical";

export default function LexicalEditor({ value, setValue }) {
  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      paragraph: "editor-paragraph",
      heading: "editor-heading",
    },
    onError(error) {
      console.error(error);
    },
  };

  function handleChange(editorState) {
    editorState.read(() => {
      const root = $getRoot();
      const selection = $getSelection();
      setValue(root.getText());
    });
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<div style={{ color: "#aaa" }}>Write your article...</div>}
      />
      <HistoryPlugin />
      <OnChangePlugin onChange={handleChange} />
    </LexicalComposer>
  );
}
