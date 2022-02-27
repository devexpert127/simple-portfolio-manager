import { useMemo } from 'react';
// import { useRecoilValue } from 'recoil';
import { OptionMarketWithKey } from '@mithraic-labs/psy-american';
// import { selectAllOptions } from '../recoil';
import { TokenAccount2 } from '../types';
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

export const useWrittenOptions = (): Record<string, TokenAccount2[]> => {
  let optionsD : OptionMarketWithKey[]=[]
  const { projectOption } = useSelector((state: TStore) => state.projectReducer)
  Object.keys(projectOption).map((key) => {
    let projectoptions = projectOption[key].options
    projectoptions.map((option)=>{
      optionsD.push(option.optionMarket)
    })
   
  });
  // const options = useRecoilValue(selectAllOptions);
  
  const { ownedTokenAccounts } = useOwnedTokenAccounts();
  return useMemo(() => {
    const positions = optionsD.reduce((acc, option) => {
      // const accountsWithHoldings = ownedTokenAccounts[
      //   option.writerTokenMint.toString()
      // ]?.filter((writerTokenAcct) => writerTokenAcct.amount > 0);
      // ];
      let accountsWithHoldings : TokenAccount2[] = [];
      Object.keys(ownedTokenAccounts).map((key)=>{
        let bump = ownedTokenAccounts[key]
        accountsWithHoldings=bump
      })
      
      if (accountsWithHoldings?.length) {
        acc[option.key.toString()] = accountsWithHoldings;
      }
      
      return acc;
    }, {} as Record<string, TokenAccount2[]>);
    return positions;
  }, [optionsD, ownedTokenAccounts]);
};
