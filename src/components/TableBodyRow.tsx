import React, { memo, useEffect, useMemo, useState } from 'react';
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
import { OptionAccounts, Project, MintInfoWithKey, CallOrPut, SerumMarketAndProgramId } from '../types';
import { OptionMarketWithKey } from '@mithraic-labs/psy-american';
import { Tokens } from "@mithraic-labs/psy-token-registry";
import { useSerumPriceByAssets } from '../hooks/useSerumPriceByAssets'

import { useOptionsChainFromMarketsState } from '../hooks/useOptionChainsFromMarketsState'
import {
  quoteMint,
  selectExpirationAsDate,
  selectMintsOfFutureOptions,
  selectUnderlyingMintWithSideEffects,
  underlyingAmountPerContract,
  useUpdateLastOptionParamsByAssetPair,
} from '../recoil';

import useSerum from '../hooks/useSerum';
import { calculateStrikePrecision } from '../utils/getStrikePrices';

const TableBodyRow: React.VFC<{
  project : Project;
  optionAccount: OptionMarketWithKey;
  optionKey : PublicKey;
  mintInfos: Record<string, MintInfoWithKey>;
  index:number;
}> = ({ project, optionAccount, optionKey, mintInfos,index }) => {
  // const option = useRecoilValue(optionsMap(optionKey.toString()));

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

    useState(false);


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
 
  // const optionUnderlyingAssetSymbol =
  //   optionUnderlyingAsset?.symbol ??
  //   row_option?.underlyingAssetMint.toString() ??
  //   '';
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
    const rowTemplate = {
      call: {
        key: '',
        change: '',
        volume: '',
        openInterest: '',
        size: '',
        emptyRow: true,
        actionInProgress: false,
      },
      put: {
        key: '',
        change: '',
        volume: '',
        openInterest: '',
        size: '',
        emptyRow: true,
        actionInProgress: false,
      },
    };
    const chains = useOptionsChainFromMarketsState();
    const [_underlyingMint, setUnderlyingMint] = useRecoilState(
      selectUnderlyingMintWithSideEffects,
    );
    const [_quoteMint, setQuoteMint] = useRecoilState(quoteMint);

    setUnderlyingMint(row_option.underlyingAssetMint)
    setQuoteMint(row_option.quoteAssetMint)

    const mints = useRecoilValue(selectMintsOfFutureOptions);
    // const expirationDateString = useRecoilValue(selectExpirationAsDate);
    const contractSize = useRecoilValue(underlyingAmountPerContract);
    const underlyingAsset = useTokenByMint(_underlyingMint ?? '');
    const { serumMarkets, fetchMultipleSerumMarkets } = useSerum();
    const [round, setRound] = useState(true);
    const [callPutData, setCallPutData] = useState({ type: 'call' } as CallOrPut);
    const [initialMarkPrice, setInitialMarkPrice] = useState<number | null>(null);
    const [limitPrice, setLimitPrice] = useState('0');
    const rowsPerPage = 7;
    const [page, setPage] = useState(0);

    const  markPrice = useSerumPriceByAssets(
        row_option.underlyingAssetMint.toString() ?? null,
        row_option.quoteAssetMint?.toString() ?? null,
      );

      useEffect(() => {
        if (!initialMarkPrice) {
          setInitialMarkPrice(markPrice);
        }
      }, [initialMarkPrice, markPrice, setInitialMarkPrice]);

      let precision = 0;
      if (round && chains[0]?.strike) {
        precision = calculateStrikePrecision(chains[0].strike);
      }
    
      const filteredChain = chains;

      const numberOfPages = Math.ceil(filteredChain.length / rowsPerPage);

      const rowsToDisplay = useMemo(() => {
        return filteredChain.slice(rowsPerPage * page, rowsPerPage * (page + 1));
      }, [filteredChain, page]);

      // handle pagination and add
      const rows = useMemo(
        () => [
          ...rowsToDisplay,
          ...Array(Math.max(rowsPerPage - rowsToDisplay.length, 0))
            .fill(rowTemplate)
            .map((row, i) => ({
              ...row,
              key: `empty-${i}`,
            })),
        ],
        [rowsToDisplay],
      );

      useEffect(() => {
        const serumKeys: SerumMarketAndProgramId[] = [];
        rowsToDisplay.forEach(({ call, put }) => {
          if (
            call?.serumMarketKey &&
            !serumMarkets[call.serumMarketKey.toString()]
          ) {
            serumKeys.push({
              serumMarketKey: call.serumMarketKey,
              serumProgramId: call.serumProgramId,
            });
          }
          if (put?.serumMarketKey && !serumMarkets[put.serumMarketKey.toString()]) {
            serumKeys.push({
              serumMarketKey: put.serumMarketKey,
              serumProgramId: put.serumProgramId,
            });
          }
        });

        if (serumKeys.length) {
          fetchMultipleSerumMarkets(serumKeys);
        }
      }, [chains, rowsToDisplay, fetchMultipleSerumMarkets, serumMarkets]);
  const canClose = (ownedOptionTokenAccounts?.[0]?.amount || 0) > 0;

  let ActionFragment: React.ReactNode = null;
  

  return (
        <tr > 
              <td data-label="ID" scope="row">{index + 1}</td>
              <td data-label="ExpDate">{ formatExpirationTimestamp(
                  row_option?.expirationUnixTimestamp.toNumber() ?? 0,
                ) }</td>
              <td data-label="OptionType">{isCall ? 'Call' : 'Put'}</td>
              <td data-label="UnderSymbol">{underlyingAssetSymbol}&nbsp;&nbsp;&nbsp;<img src={underlyingAssetLogo} style={{width:'20px', height:"20px"}}/></td>
              <td data-label="UnderAmount">{normalizedUnderlyingAmount.toString()}</td>
              {/* <td data-label="QuoteAmount"></td> */}
              <td data-label="QuoteSymbol">{quoteAssetSymbol}&nbsp;&nbsp;&nbsp;<img src={optionQuoteAsset.logoURI} style={{width:'20px', height:"20px"}}/></td>
              <td data-label="StrikePrice">$ {strike.toString()}</td>
              <td data-label="LockedAsset"><div>{lockedAmountDisplay} {optionUnderlyingAssetSymbol}</div></td>
              <td data-label="Action"><div>{ActionFragment}</div></td>
        </tr>
    
  );
};

export default memo(TableBodyRow);
