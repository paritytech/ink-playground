import { Console } from './Console';
import { InkEditor, exampleCode } from '@paritytech/ink-editor';
import { Layout } from './Layout';
import { Header } from './Header';
import { AppContext, AppProvider } from '~/context/app/';
import { MessageContext, MessageProvider } from '~/context/messages/';
import { ReactElement, useContext, useState } from 'react';
import { Dispatch, State } from '~/context/app/reducer';
import { MessageDispatch, MessageState } from '~/context/messages/reducer';

const App = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, messageDispatch]: [MessageState, MessageDispatch] = useContext(MessageContext);

  const onRustAnalyzerStartLoad = () => {
    messageDispatch({
      type: 'LOG_SYSTEM',
      payload: { status: 'IN_PROGRESS', content: 'Loading Rust Analyzer...' },
    });
  };

  const onRustAnalyzerFinishLoad = () =>
    messageDispatch({
      type: 'LOG_SYSTEM',
      payload: { status: 'DONE', content: 'Rust Analyzer Ready' },
    });

  return (
    <>
      {state.code}
      <Layout
        header={<Header />}
        editor={
          <InkEditor
            code={state.code}
            onCodeChange={code => dispatch({ type: 'SET_CODE', payload: code })}
            onRustAnalyzerStartLoad={onRustAnalyzerStartLoad}
            onRustAnalyzerFinishLoad={onRustAnalyzerFinishLoad}
            numbering={state.numbering}
            darkmode={state.darkmode}
            minimap={state.minimap}
            setURI={uri => dispatch({ type: 'SET_URI', payload: uri })}
          />
        }
        console={<Console />}
      />
    </>
  );
};

const AppWithProvider = (): ReactElement => {
  return (
    <AppProvider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </AppProvider>
  );
};

export default AppWithProvider;
