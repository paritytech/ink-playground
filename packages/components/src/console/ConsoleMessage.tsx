import { ReactElement } from 'react';

interface Props {
  message: Message;
  mIndex: number;
}

export type Message = {
  id: number;
  prompt: Prompt;
  status: Status;
  severity: Severity;
  content?: string;
  preContent?: string;
  preContentColor?: string;
};

export type Prompt = 'COMPILE' | 'SYSTEM' | 'GIST';

export type Status = 'IN_PROGRESS' | 'DONE' | 'ERROR' | 'INFO';

export enum Severity {
  INFO = 'Info',
  DONE = 'Success',
  ERROR = 'Error',
  IN_PROGRESS = 'InProgress',
}

export type SeverityColors = {
  Info: string;
  Success: string;
  Error: string;
  InProgress: string;
};

const severityColors: SeverityColors = {
  Info: 'text-info',
  Success: 'text-success',
  Error: 'text-error',
  InProgress: 'text-in-progress',
};

const selectIcon = (status: Status): string => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'pi pi-spinner animate-spin';
    case 'DONE':
      return 'pi pi-check';
    case 'ERROR':
      return 'pi pi-times';
    default:
      return 'pi pi-info-circle';
  }
};

const Prompt = ({ message: m, mIndex }: Props): ReactElement => {
  const severity: Severity = m.severity;
  const icon: string = selectIcon(m.status);

  return (
    <div className="whitespace-nowrap flex self-start content-center">
      <div className="w-6">
        <i
          className={`${icon} ${severityColors[severity]} leading-normal top-inset-0.5`}
          data-testid={`icon-${mIndex}`}
        />
      </div>
      <span className={`${severityColors[severity]} mt-px3 mr-1 font-mono`}>{m.prompt}:</span>
    </div>
  );
};

export const ConsoleMessage = ({ message: m, mIndex }: Props): ReactElement => {
  return (
    <div className="flex mb-1 basis-zero" data-testid={`message-${mIndex}-${m.status}`}>
      <Prompt message={m} mIndex={mIndex} />
      <span className="pl-2 mt-px2 font-mono">
        {m.preContent && <span className={m.preContentColor}>{m.preContent} </span>}
        {m?.content?.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </span>
    </div>
  );
};
