import * as React from "react";
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

export class StyledEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snippet: this.props.snippet,
      theme: this.props.theme,
      language: this.props.lang,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange = (editor, data, value) => {
    this.setState({ snippet: value });
  };

  render() {
    const OPTIONS = {
      theme: `${this.state.theme}`,
      autoCloseBrackets: true,
      cursorScrollMargin: 48,
      mode: `${this.state.language}`,
      lineNumbers: false,
      indentUnit: 2,
      tabSize: 2,
      styleActiveLine: true,
      viewportMargin: 99,
    };

    return (
      <React.Fragment>
        <PureEditor
          name="js"
          value={this.state.snippet}
          options={OPTIONS}
          onChange={this.onChange}
        />
        <Style css={this.state.snippet} />
      </React.Fragment>
    );
  }
}

class PureEditor extends React.PureComponent {
  render() {
    return (
      <CodeMirror
        value={this.props.value}
        options={this.props.options}
        onBeforeChange={this.props.onChange}
      />
    );
  }
}

export const Style = (props) => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: props.css,
      }}
    />
  );
};
