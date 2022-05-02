import { CompileApiResponse, compileRequest } from '@paritytech/ink-editor/api/compile';
import { monaco } from '@paritytech/ink-editor/';
import { State, Dispatch } from '~/context/app/reducer';
import { MessageAction, MessageDispatch } from '~/context/messages/reducer';
import { COMPILE_URL } from '~/env';

const getMessageAction = (result: CompileApiResponse): MessageAction | undefined => {
  switch (result.type) {
    case 'NETWORK_ERROR':
      return {
        type: 'LOG_COMPILE',
        payload: {
          content: 'Network Error',
          status: 'ERROR',
        },
      };
    case 'SERVER_ERROR':
      return {
        type: 'LOG_COMPILE',
        payload: {
          content: `Server Error: ${result.payload.status}`,
          status: 'ERROR',
        },
      };
    case 'OK':
      if (result.payload.type === 'ERROR') {
        return {
          type: 'LOG_COMPILE',
          payload: {
            content: `Compilation Error: ${result.payload.payload.stdout}, ${result.payload.payload.stderr}`,
            status: 'ERROR',
          },
        };
      } else if (result.payload.type === 'SUCCESS') {
        return {
          type: 'LOG_COMPILE',
          payload: {
            content: 'Compilation finished',
            status: 'DONE',
            result: result.payload,
          },
        };
      }
  }
};

export const extractContractSize = (stdout: string): number => {
  const regex = /([0-9]+\.[0-9]+)K/g;
  const result = stdout.match(regex);
  if (!result || !result[1]) return NaN;
  return parseFloat(result[1]);
};

export async function compile(state: State, dispatch: Dispatch, dispatchMessage: MessageDispatch) {
  if (state.compile.type === 'IN_PROGRESS') return;

  dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'IN_PROGRESS' } });

  dispatchMessage({
    type: 'LOG_COMPILE',
    payload: {
      content: 'Compilation has started...',
      status: 'IN_PROGRESS',
    },
  });

  const { monacoUri: uri } = state;

  if (!uri) {
    // ToDo: implement proper error handling
    dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'NOT_ASKED' } });
    return;
  }

  const model = monaco.editor.getModel(uri);

  if (!model) {
    // ToDo: implement proper error handling
    dispatch({ type: 'SET_COMPILE_STATE', payload: { type: 'NOT_ASKED' } });
    return;
  }

  const code = model.getValue();

  const result = await compileRequest({ compileUrl: COMPILE_URL || '' }, { source: code });

  dispatch({
    type: 'SET_COMPILE_STATE',
    payload: { type: 'RESULT', payload: result },
  });

  if (result.type === 'OK' && result.payload.type === 'SUCCESS') {
    const contractSize = extractContractSize(result.payload.payload.stdout);
    dispatch({
      type: 'SET_CONTRACT_SIZE',
      payload: contractSize,
    });
  } else {
    dispatch({
      type: 'SET_CONTRACT_SIZE',
      payload: null,
    });
  }

  const action: MessageAction | undefined = getMessageAction(result);
  if (action) dispatchMessage(action);
}
