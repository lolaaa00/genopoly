export interface GenLayerCallResult {
  hash?: string;
  data?: unknown;
  error?: string;
}

export interface ContractCallOptions {
  gameId: string;
  sender: string;
  value?: number;
  args?: unknown[];
}
