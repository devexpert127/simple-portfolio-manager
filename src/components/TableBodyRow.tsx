import React, { memo, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { TStore } from '../store';
import {
  Avatar,
  Box,
  Button,
  Tooltip,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { formatExpirationTimestamp } from '../utils/format';
import useOwnedTokenAccounts from '../hooks/useOwnedTokenAccounts';
import { useOptionVaultAmounts } from '../hooks/useOptionVaultAmounts';
import { PublicKey } from '@solana/web3.js';
import {useOpenPositions} from '../hooks/useOpenPositions';
import { useWrittenOptions } from '../hooks/useWrittenOptions';
import { useRecoilState, useRecoilValue } from 'recoil';
import { optionsMap } from '../recoil';
import { BN } from '@project-serum/anchor';
import { useOptionIsCall } from '../hooks/useOptionIsCall';
import { useNormalizedStrikePriceFromOption } from '../hooks/useNormalizedStrikePriceFromOption';
import { useTokenByMint } from '../hooks/useNetworkTokens';
import { useNormalizeAmountOfMintBN } from '../hooks/useNormalizeAmountOfMintBN';
import { Project, MintInfoWithKey, CallOrPut, TotalItems } from '../types';
import { OptionMarketWithKey } from '@mithraic-labs/psy-american';
import { Tokens } from "@mithraic-labs/psy-token-registry";
import { useSerumPriceByAssets } from '../hooks/useSerumPriceByAssets';
import useSerum from '../hooks/useSerum';

import {
  quoteMint,
  selectUnderlyingMintWithSideEffects,
} from '../recoil';



const TableBodyRow: React.VFC<{
  project : Project;
  optionAccount: OptionMarketWithKey;
  optionKey : PublicKey;
  mintInfos: Record<string, MintInfoWithKey>;
  index:number;
  serumAddress : PublicKey;
  totalitems : TotalItems;
}> = ({ project, optionAccount, optionKey, mintInfos,index, serumAddress, totalitems }) => {
  // const option = useRecoilValue(optionsMap(optionKey.toString()));
  const { grantNumber } = useSelector((state: TStore) => state.projectReducer)
  
  const row_option = optionAccount;
  const writtenOptions = useWrittenOptions();
  const writerTokenAccounts = writtenOptions[optionKey.toString()] ?? [];
//   const { formFactor } = useScreenSize();
  const { ownedTokenAccounts } = useOwnedTokenAccounts();
  const normalizeOptionUnderlying = useNormalizeAmountOfMintBN(
    mintInfos[row_option.underlyingAssetMint.toString()]?? null,
  );
  const normalizeOptionQuote = useNormalizeAmountOfMintBN(
    mintInfos[row_option.underlyingAssetMint.toString()]?? null,
  );

  const expired = useMemo(() => {
    const nowInSeconds = Date.now() / 1000;
    return !!row_option?.expirationUnixTimestamp.lt(new BN(nowInSeconds));
  }, [row_option?.expirationUnixTimestamp]);


    // const optionUnderlyingAsset = useTokenByMint(row_option?.underlyingAssetMint ?? '',);
    let underlyingMint = mintInfos[row_option.underlyingAssetMint.toString()];
    const optionUnderlyingAsset = Tokens.devnet[underlyingMint.pubkey.toString()];

  let quoteMints = mintInfos[row_option.quoteAssetMint.toString()];
  const optionQuoteAsset = Tokens.devnet[quoteMints.pubkey.toString()];

  // const optionQuoteAsset = useTokenByMint(row_option?.quoteAssetMint ?? '');
  
  const isCall = useOptionIsCall(row_option);

  const strike = useNormalizedStrikePriceFromOption(
    underlyingMint,
    quoteMints,
    row_option,
    isCall,
  );
 
  const optionUnderlyingAssetSymbol =
    optionUnderlyingAsset?.symbol.toUpperCase() ??
    project?.symbol ??
    '';
    
  const optionQuoteAssetSymbol =
    optionQuoteAsset?.symbol.toUpperCase() ?? row_option?.quoteAssetMint.toString() ?? '';

  const underlyingAssetSymbol = isCall? optionUnderlyingAssetSymbol : optionQuoteAssetSymbol;
  const quoteAssetSymbol = isCall? optionQuoteAssetSymbol: optionUnderlyingAssetSymbol;
  
  const underlyingAssetLogo = isCall
    ? optionUnderlyingAsset?.logoURI
    : optionQuoteAsset?.logoURI;

  const writerTokenAccount = writerTokenAccounts?.[0];
  
  const ownedOptionTokenAccounts =
    ownedTokenAccounts[row_option?.optionMint.toString() ?? ''];
  
  // amount of underlying without taking into account call/put
  const normalizedOptionUnderlyingAmount = normalizeOptionUnderlying( row_option?.underlyingAmountPerContract );
  const normalizedUnderlyingAmount = isCall
    ? normalizedOptionUnderlyingAmount
    : normalizeOptionQuote(row_option?.quoteAmountPerContract);


  const lockedAmount = writerTokenAccount.amount * normalizedOptionUnderlyingAmount.toNumber();
  const lockedAmountDisplay = `${lockedAmount}`.match(/\.(.{4,})$/)
    ? `≈${lockedAmount.toFixed(3)}`
    : lockedAmount;

///////////////////////////////////   Market Info getting     ////////////////////////////////////////////



    const  mark_open_Price = useSerumPriceByAssets(
        row_option.underlyingAssetMint.toString() ?? null,
        row_option.quoteAssetMint?.toString() ?? null,
        serumAddress
      );
    const current_PnL = (mark_open_Price.price - mark_open_Price.openPrice )*parseInt(normalizedUnderlyingAmount.toString())
    
  let ActionFragment: React.ReactNode = null;

  return (
        <tr > 
          <td data-label="ID" scope="row">{index + 1}</td>
          <td data-label="option" scope="row">
            {underlyingAssetSymbol}-{quoteAssetSymbol}
          </td>
          <td data-label="ExpDate">{ formatExpirationTimestamp(
              row_option?.expirationUnixTimestamp.toNumber() ?? 0,
            ) }</td>
          <td data-label="OptionType">{isCall ? 'Call' : 'Put'}</td>
          <td data-label="originGrant"> {totalitems.granted}</td>
          <td data-label="vestedOption"> {totalitems.vested}</td>
          <td data-label="exercisedOtion"> {totalitems.exercised}</td>
          <td data-label="exerciseableOption"> {totalitems.exerciseable}</td>
          <td data-label="StrikePrice">$ {strike.toString()}</td>
        </tr>
  );
};

export default memo(TableBodyRow);
