import * as Comlink from 'comlink';
import { monaco } from 'react-monaco-editor';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

import { WorkerApi } from '../../WasmTest/wasm.worker';

import { configureLanguage, setTokens, Token } from './configureLanguage';

const modeId = 'ra-rust'; // not "rust" to circumvent conflict

export const startRustAnalyzer = async (uri: Uri) => {
  const model = monaco.editor.getModel(uri);
  if (!model) return;

  monaco.languages.register({
    // language for editor
    id: modeId,
  });
  monaco.languages.register({
    // language for hover info
    id: 'rust',
  });
  const rustConf = await import(
    /* webpackChunkName: "monaco-editor" */ 'monaco-editor/esm/vs/basic-languages/rust/rust'
  );
  monaco.editor.setModelLanguage(model, 'rust');
  monaco.languages.setLanguageConfiguration('rust', rustConf.conf);
  monaco.languages.setMonarchTokensProvider('rust', rustConf.language);
  monaco.languages.setLanguageConfiguration(modeId, rustConf.conf);

  const state = await Comlink.wrap<WorkerApi>(
    new Worker(new URL('../../WasmTest/wasm.worker', import.meta.url), {
      type: 'module',
    })
  ).handlers;

  const allTokens: Array<Token> = [];
  monaco.languages.onLanguage(modeId, configureLanguage(monaco, state, allTokens));

  const data = await fetch(`./change.json`);
  const textData = await data.text();
  await state.load(textData);

  async function update() {
    if (!model) return;
    const text = model.getValue();
    await state.update(text);
    const res = await state.analyze(183);
    console.log(res);
    monaco.editor.setModelMarkers(model, modeId, res.diagnostics);
    allTokens.length = 0;
    allTokens.push(...res.highlights);
    setTokens(monaco, allTokens);
  }

  await update();
  model.onDidChangeContent(update);

  // rust analyzer loaded and diagnostics ready -> switch to rust analyzer
  monaco.editor.setModelLanguage(model, modeId);
};
