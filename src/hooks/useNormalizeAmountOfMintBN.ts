import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useTokenMintInfo } from './useTokenMintInfo';
// import { TStore } from "../store";
import { MintInfoWithKey } from '../types';

const TEN_BIGNUM = new BigNumber(10);
const ZERO_BIGNUM = new BigNumber(10);

// export const useNormalizeAmountOfMintBN = (
//   mint: PublicKey | null | undefined,
// ): ((num: BN | undefined) => BigNumber) => {
//   // const { mintInfo } = useSelector((state: TStore) => state.projectReducer)
//   const mintInfos = useTokenMintInfo(mint);
//   return useCallback(
//     (num: BN | undefined) => {
  
//       if (!num) {
//         return ZERO_BIGNUM;
//       }
//       const bigNum = new BigNumber(num.toString());
//       const mintDecimalsBIGNUM = new BigNumber(mintInfos?.decimals ?? 0);
//       return bigNum.multipliedBy(TEN_BIGNUM.pow(mintDecimalsBIGNUM.negated()));
//     },
//     [mintInfos?.decimals],
//   );
// };

export const useNormalizeAmountOfMintBN = (
  mint: MintInfoWithKey | null | undefined,
): ((num: BN | undefined) => BigNumber) => {
  // const { mintInfo } = useSelector((state: TStore) => state.projectReducer)
  const mintInfos = mint;
  return useCallback(
    (num: BN | undefined) => {
  
      if (!num) {
        return ZERO_BIGNUM;
      }
      const bigNum = new BigNumber(num.toString());
      const mintDecimalsBIGNUM = new BigNumber(mintInfos?.decimals ?? 0);
      // console.log('SDFGHJKSDFGHJKSDFGHJK', bigNum.multipliedBy(TEN_BIGNUM.pow(mintDecimalsBIGNUM.negated())))
      return bigNum.multipliedBy(TEN_BIGNUM.pow(mintDecimalsBIGNUM.negated()));
    },
    [mintInfos?.decimals],
  );
};
