import React, { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import "../lib/styles.css";

import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/mode/jsx/jsx";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/theme/material.css";

export const StyledEditor = (props) => {
  const [snippet, setSnippet] = useState(props.snippet);
  const [lang, setLang] = useState(props.lang);
  const [editorTheme, setEditorTheme] = useState(props.theme);

  const onChange = (editor, data, value) => {
    setSnippet(value);
  };

  const OPTIONS = {
    theme: `${editorTheme}`,
    autoCloseBrackets: true,
    cursorScrollMargin: 48,
    mode: `${lang}`,
    lineNumbers: false,
    indentUnit: 2,
    tabSize: 2,
    styleActiveLine: true,
    viewportMargin: 99,
  };
  return (
    <>
      <CodeMirror
        className="editor"
        value={snippet}
        options={OPTIONS}
        onBeforeChange={onChange}
      />
      <Style snippet={snippet} />
    </>
  );
};

export const Style = (props) => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: props.snippet,
      }}
    />
  );
};
