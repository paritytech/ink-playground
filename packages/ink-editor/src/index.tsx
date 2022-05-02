import { ReactElement } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import exampleCode from './example-code';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor';
export { monaco };

const dark_teal = '67c6b0';
const dark_text = 'ffffff';
const dark_green = '709950';
const dark_orange = 'ce9178';
const dark_blue = '6298d4';
const dark_blue_secondary = '95d9fc';
const dark_yellow = 'dcdd9b';

const light_teal = '14b79d';
const light_text = '000000';
const light_green = '008000';
const light_orange = 'a51b1b';
const light_blue = '0000ff';
const light_blue_secondary = '0A59DF';
const light_yellow = 'D9CA00';

// Define an extra default theme to set the correct background colors
monaco.editor.defineTheme('default-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#1A1D1F',
    'minimap.background': '#1e2124',
  },
});

monaco.editor.defineTheme('custom-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: dark_green },
    { token: 'builtin_attr', foreground: dark_teal },
    { token: 'string_literal', foreground: dark_orange },
    { token: 'keyword', foreground: dark_blue },
    { token: 'module', foreground: dark_teal },
    { token: 'struct', foreground: dark_teal },
    { token: 'field', foreground: dark_blue_secondary },
    { token: 'builtin_type', foreground: dark_teal },
    { token: 'function', foreground: dark_yellow },
    { token: 'value_param', foreground: dark_teal },
    { token: 'self_type', foreground: dark_teal },
    { token: 'trait', foreground: dark_teal },
    { token: 'self_keyword', foreground: dark_blue },
    { token: 'variable', foreground: dark_blue_secondary },
    { token: 'unresolved_reference', foreground: dark_blue },
    { token: 'macro', foreground: dark_blue },
    { token: 'bool_literal', foreground: dark_blue_secondary },
    { token: 'none', foreground: dark_text },
    { token: 'attribute', foreground: dark_text },
    { token: 'parenthesis', foreground: dark_text },
    { token: 'operator', foreground: dark_text },
    { token: 'comma', foreground: dark_text },
    { token: 'semicolon', foreground: dark_text },
    { token: 'brace', foreground: dark_text },
    { token: 'colon', foreground: dark_text },
    { token: 'logical', foreground: dark_text },
    { token: 'punctuation', foreground: dark_text },
  ],
  colors: {
    'editor.background': '#1A1D1F',
    'minimap.background': '#1e2124',
  },
});

monaco.editor.defineTheme('custom-light', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: light_green },
    { token: 'builtin_attr', foreground: light_teal },
    { token: 'string_literal', foreground: light_orange },
    { token: 'keyword', foreground: light_blue },
    { token: 'module', foreground: light_teal },
    { token: 'struct', foreground: light_teal },
    { token: 'field', foreground: light_blue_secondary },
    { token: 'builtin_type', foreground: light_teal },
    { token: 'function', foreground: light_yellow },
    { token: 'value_param', foreground: light_teal },
    { token: 'self_type', foreground: light_teal },
    { token: 'trait', foreground: light_teal },
    { token: 'self_keyword', foreground: light_blue },
    { token: 'variable', foreground: light_blue_secondary },
    { token: 'unresolved_reference', foreground: light_blue },
    { token: 'macro', foreground: light_blue },
    { token: 'bool_literal', foreground: light_blue_secondary },
    { token: 'none', foreground: light_text },
    { token: 'attribute', foreground: light_text },
    { token: 'parenthesis', foreground: light_text },
    { token: 'operator', foreground: light_text },
    { token: 'comma', foreground: light_text },
    { token: 'semicolon', foreground: light_text },
    { token: 'brace', foreground: light_text },
    { token: 'colon', foreground: light_text },
    { token: 'logical', foreground: light_text },
    { token: 'punctuation', foreground: light_text },
  ],
  colors: {
    'minimap.background': '#f2f2f2',
  },
});

export { exampleCode };

export interface InkEditorProps {
  code?: string;
  onCodeChange?: (code: string) => void;
  onRustAnalyzerStartLoad?: () => void;
  onRustAnalyzerFinishLoad?: () => void;
  setURI?: (uri: Uri) => void;
  numbering?: boolean;
  minimap?: boolean;
  darkmode?: boolean;
  rustAnalyzer?: boolean;
}
export const InkEditor = (props: InkEditorProps): ReactElement | null => {
  const editorDidMount = async (editor: MonacoEditor['editor']): Promise<void> => {
    if (editor) {
      editor.focus();
      const model = editor.getModel();
      if (model) {
        props.setURI && props.setURI(model.uri);
        await import('./utils/startRustAnalyzer').then(async code => {
          props.onRustAnalyzerStartLoad && props.onRustAnalyzerStartLoad();
          await code.startRustAnalyzer(model.uri);
          props.onRustAnalyzerFinishLoad && props.onRustAnalyzerFinishLoad();
        });
      }
    }
  };

  const options: MonacoEditorProps['options'] = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: props.minimap },
    lineNumbers: props.numbering ? 'on' : 'off',
  };

  const darkTheme = props.rustAnalyzer ? 'custom-dark' : 'default-dark';
  const lightTheme = props.rustAnalyzer ? 'custom-light' : 'vs';

  if (Object.prototype.hasOwnProperty.call(props, 'code'))
    return (
      <MonacoEditor
        language="rust"
        theme={props.darkmode ? darkTheme : lightTheme}
        value={props.code}
        options={options}
        onChange={props.onCodeChange}
        editorDidMount={editorDidMount}
      />
    );
  return null;
};
