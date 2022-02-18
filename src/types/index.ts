import { OptionMarketWithKey } from '@mithraic-labs/psy-american';
import { AccountInfo, MintInfo, u64 } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export type Account = {
  pubKey: string;
  accountName?: string
};

export type TableData = {
  expDate: string;
  underAmount: number;
  unerSymbol: string;
  underLogo: string;
  quoteAmount: string;
  quoteSymbol: string;
  quoteLogo: string;
  mintFeeAcc: string;
  exerciseFeeAcc: string;
};

export type CandleChartData = {
  time: string,
  open: number,
  high: number,
  low: number,
  close: number
};

export type Asset = {
  tokenSymbol: string;
  mintAddress: string;
  decimals: number;
  icon?: string;
  tokenName?: string;
};

export type Project = {
  key: string;
  name: string;
  description: string;
  mintAddress: string;
  symbol: string;
  logo: string;
  serumSpotMarket?: string;
  website: string;
  twitter: string;
  discord: string;
}

export type TokenAccount = {
  address: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: u64;
  delegate: PublicKey;
  isInitialized: boolean;
  isNative: boolean;
  delegatedAmount: u64;
  closeAuthority: PublicKey;
}

export type OptionAccounts = {
  optionMarket: OptionMarketWithKey;
  tokenAccount: TokenAccount;
}

export type ProjectOptions = {
  project: Project;
  options: OptionAccounts[];
};

export type MintInfoWithKey = {
  pubkey: PublicKey;
} & MintInfo;
