import { useMemo } from 'react';
// import { useRecoilValue } from 'recoil';
import { OptionMarketWithKey } from '@mithraic-labs/psy-american';
// import { selectAllOptions } from '../recoil';
import { TokenAccount2, TokenAccount } from '../types';
import useOwnedTokenAccounts from './useOwnedTokenAccounts';

import { useDispatch, useSelector } from "react-redux";
import { TStore } from "../store";

/**
 * Check the owned tokens for tokens that match the writer mint
 *
 * @example // structure
 * {
 *  1617235200-SRM-USDC-10-10: [
 *    {
 *      amount: number
 *      mint: PublicKey
 *      pubKey: string
 *    }
 *  ]
 * }
 */

export const useWrittenOptions = (): Record<string, TokenAccount[]> => {
  let optionsD : OptionMarketWithKey[]=[];
  let tokensD : Record<string, TokenAccount[]> = {};
  // let tokensD : TokenAccount[] = [];
  const { projectOption } = useSelector((state: TStore) => state.projectReducer)
  Object.keys(projectOption).map((key) => {
    let projectoptions = projectOption[key].options
    projectoptions.map((option)=>{
      optionsD.push(option.optionMarket)
      let key = option.optionMarket.writerTokenMint.toString()
      
      if (tokensD[key]) {
        tokensD[key].push(option.tokenAccount);
      } else {
        tokensD[key] = [option.tokenAccount];
      }
    })
   
  });
  
  const { ownedTokenAccounts } = useOwnedTokenAccounts();
  // const  ownedTokenAccounts  = tokensD;
  console.log('4444444444444444', tokensD)
  return useMemo(() => {
    const positions = optionsD.reduce((acc, option) => {
      // const accountsWithHoldings = ownedTokenAccounts[
      //   option.writerTokenMint.toString()
      // ]?.filter((writerTokenAcc) => writerTokenAcc.amount > 0);

      // const accountsWithHoldings1 = tokensD[
      //   option.writerTokenMint.toString()
      // ]?.filter((writerTokenAcc) => writerTokenAcc.amount > 0);
      // console.log('5555555555555555555555', accountsWithHoldings1)
      const accountsWithHoldings1 = tokensD[
        option.writerTokenMint.toString()
      ]
      if (accountsWithHoldings1?.length) {
        acc[option.key.toString()] = accountsWithHoldings1;
      }
      return acc;
    }, {} as Record<string, TokenAccount[]>);
    return positions;
  }, [optionsD, ownedTokenAccounts]);
};
