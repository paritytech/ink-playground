import { CompileApiResponse } from '@paritytech/ink-editor/api/compile';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';
import { GistCreateApiResponse } from '@paritytech/ink-editor/api/gists';

export const defaultState: State = {
  darkmode: true,
  minimap: true,
  numbering: true,
  compile: { type: 'NOT_ASKED' },
  monacoUri: null,
  gist: { type: 'NOT_ASKED' },
  contractSize: null,
  code: '',
};

export type State = {
  darkmode: boolean;
  minimap: boolean;
  numbering: boolean;
  compile: CompileState;
  monacoUri: Uri | null;
  gist: GistState;
  contractSize: number | null;
  code: string;
};

export type GistState =
  | { type: 'NOT_ASKED' }
  | { type: 'IN_PROGRESS' }
  | { type: 'RESULT'; payload: GistCreateApiResponse };

export type CompileState =
  | { type: 'NOT_ASKED' }
  | { type: 'IN_PROGRESS' }
  | { type: 'RESULT'; payload: CompileApiResponse };

export type Action =
  | { type: 'SET_DARKMODE'; payload: boolean }
  | { type: 'SET_NUMBERING'; payload: boolean }
  | { type: 'SET_MINIMAP'; payload: boolean }
  | { type: 'SET_COMPILE_STATE'; payload: CompileState }
  | { type: 'SET_GIST_STATE'; payload: GistState }
  | { type: 'SET_URI'; payload: Uri }
  | { type: 'SET_CONTRACT_SIZE'; payload: number | null }
  | { type: 'SET_CODE'; payload: string };

export type Dispatch = (action: Action) => void;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DARKMODE':
      return {
        ...state,
        darkmode: action.payload,
      };
    case 'SET_NUMBERING':
      return {
        ...state,
        numbering: action.payload,
      };
    case 'SET_MINIMAP':
      return {
        ...state,
        minimap: action.payload,
      };
    case 'SET_COMPILE_STATE':
      return {
        ...state,
        compile: action.payload,
      };
    case 'SET_GIST_STATE':
      return {
        ...state,
        gist: action.payload,
      };
    case 'SET_URI':
      return {
        ...state,
        monacoUri: action.payload,
      };
    case 'SET_CONTRACT_SIZE':
      return {
        ...state,
        contractSize: action.payload,
      };
    case 'SET_CODE':
      return {
        ...state,
        code: action.payload,
      };
  }
};
