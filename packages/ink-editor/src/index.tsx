import exampleCode from './example-code';
import { InkEditor, InkEditorProps } from './ink-editor';
import { compileRequest } from './api/compile';
import { gistCreateRequest, gistLoadRequest } from './api/gists';
import { testingRequest } from './api/testing';
import type { GistCreateApiResponse } from './api/gists';
import type { CompileApiResponse } from './api/compile';
import type { TestingApiResponse } from './api/testing';
export {
  exampleCode,
  InkEditor,
  compileRequest,
  gistCreateRequest,
  gistLoadRequest,
  testingRequest,
};
export type { InkEditorProps, GistCreateApiResponse, CompileApiResponse, TestingApiResponse };
