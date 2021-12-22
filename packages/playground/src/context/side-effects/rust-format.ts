import { CompileApiResponse, compileRequest } from '@paritytech/ink-editor/api/compile';
import { State, Dispatch } from '~/context/app/reducer';
import { MessageAction, MessageDispatch } from '~/context/messages/reducer';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { RUST_FORMAT_URL } from '~/env';
import { rustFormatRequest } from '@paritytech/ink-editor/api/rust_format';

export async function rustFormat(
  state: State,
  dispatch: Dispatch,
  dispatchMessage: MessageDispatch
) {
  if (state.compile.type === 'IN_PROGRESS') return;

  const { monacoUri: uri } = state;

  if (!uri) {
    dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'NOT_ASKED' } });
    return;
  }

  const model = monaco.editor.getModel(uri);

  if (!model) {
    dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'NOT_ASKED' } });
    return;
  }

  const oldCode = model?.getValue();

  const newCode = await rustFormatRequest(
    { rustFormatUrl: RUST_FORMAT_URL || '' },
    { code: oldCode }
  );

  if (!(newCode.type === 'OK')) {
    return;
  }

  model?.setValue(newCode.payload.payload);

  dispatch({ type: 'SET_CODE', payload: 'foo' });
}
