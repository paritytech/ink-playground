import * as Common from '@paritytech/commontypes';

export type RustFormatApiRequest = Common.RustFormatRequest;

export type RustFormatApiResponse =
  | {
      type: 'OK';
      payload: Common.RustFormatResponse;
    }
  | {
      type: 'NETWORK_ERROR';
    }
  | {
      type: 'SERVER_ERROR';
      payload: { status: number };
    };

export type Config = {
  rustFormatUrl: string;
};

const mapResponse = async (response: Response): Promise<RustFormatApiResponse> =>
  response.status === 200
    ? {
        type: 'OK',
        payload: await response.json(),
      }
    : {
        type: 'SERVER_ERROR',
        payload: { status: response.status },
      };

export const rustFormatRequest = (
  config: Config,
  request: RustFormatApiRequest
): Promise<RustFormatApiResponse> => {
  const opts: RequestInit = {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  };

  return fetch(config.rustFormatUrl || '', opts)
    .then(mapResponse)
    .catch(() => ({ type: 'NETWORK_ERROR' }));
};
