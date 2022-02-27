import { OptionMarketWithKey } from '@mithraic-labs/psy-american';
import { AccountInfo, MintInfo, u64 } from '@solana/spl-token';

import BigNumber from 'bignumber.js';
import { BN } from '@project-serum/anchor';
import { Market } from '@mithraic-labs/serum';
import { PublicKey, Signer, Transaction } from '@solana/web3.js';

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
  amount: Number;
  delegate: PublicKey;
  isInitialized: boolean;
  isNative: boolean;
  delegatedAmount: u64;
  closeAuthority: PublicKey;
}

export type TokenAccount2 = {
  amount: number;
  mint: PublicKey;
  // public key for the specific token account (NOT the wallet)
  pubKey: PublicKey;
};

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


export enum ClusterName {
  devnet = 'Devnet',
  mainnet = 'Mainnet',
  testnet = 'Testnet',
  localhost = 'localhost',
  custom = 'Custom',
}

export enum NotificationSeverity {
  ERROR = 'error',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
}
type NotificationData = {
  severity: NotificationSeverity;
  message: string;
};

export interface InstructionErrorResponse extends NotificationData {
  err?: Error;
}

export enum OptionType {
  CALL = 'call',
  PUT = 'put',
}

export type OptionMarket = {
  key: string;
  // Leave these in tact as BigNumbers to use later for creating the reciprocal put/call
  pubkey: PublicKey;
  amountPerContract: BigNumber;
  quoteAmountPerContract: BigNumber;
  amountPerContractBN: BN;
  quoteAmountPerContractBN: BN;
  strike: BigNumber;
  strikePrice?: string;
  size: string;
  expiration: number;
  uAssetSymbol: string;
  qAssetSymbol: string;
  uAssetMint: string;
  qAssetMint: string;
  optionMintKey: PublicKey;
  optionMarketKey: PublicKey;
  writerTokenMintKey: PublicKey;
  underlyingAssetPoolKey: PublicKey;
  underlyingAssetMintKey: PublicKey;
  quoteAssetPoolKey: PublicKey;
  quoteAssetMintKey: PublicKey;
  serumMarketKey?: PublicKey;
  psyOptionsProgramId: string;
  serumProgramId: string;
};

export type LocalSerumMarket = {
  loading?: boolean;
  error?: Error | string;
  serumMarket?: Market;
  serumProgramId?: string;
};

export type SerumMarketAndProgramId = {
  serumMarketKey: PublicKey;
  serumProgramId: string;
};

export type CallOrPut = OptionRow & {
  type: OptionType;
  strike: BigNumber;
};

export type OptionRow = OptionMarket & {
  emptyRow?: boolean;
  key: PublicKey;
  change: string;
  volume: string;
  openInterest: string;
  serumMarketKey?: PublicKey;
  initialized: boolean;
  fraction: string;
  reciprocalFraction: string;
};

export interface CreateMissingMintAccountsRes extends InstructionResponse {
  mintedOptionDestinationKey: PublicKey;
  writerTokenDestinationKey: PublicKey;
  underlyingAssetSource: PublicKey;
}

export interface CreateNewTokenAccountResponse extends InstructionResponse {
  newTokenAccount: Signer;
}

export type InstructionResponse = {
  transaction: Transaction;
  signers: Signer[];
};

export type Result<T, E> = {
  response?: T;
  error?: E;
};