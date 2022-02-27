import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Link } from 'react-router-dom';
import { OptionMarket } from "@mithraic-labs/psy-american";
import { Tokens } from "@mithraic-labs/psy-token-registry";
import { bnToFloat, formatStrike } from "../lib/utils";

import { MintInfoWithKey, OptionAccounts, Project, TableData, SerumMarketAndProgramId, CallOrPut, OptionType } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";
import { PublicKey } from '@solana/web3.js';
import { useRecoilValue } from 'recoil';
import { activeNetwork, optionsMap, quoteMint, selectOptionsByMarketsPageParams, underlyingAmountPerContract, underlyingMint, } from '../recoil';
import { useWrittenOptions } from '../hooks/useWrittenOptions';
import { useOpenPositions } from '../hooks/useOpenPositions';
import { useNormalizeAmountOfMintBN } from '../hooks/useNormalizeAmountOfMintBN';
import TableBodyRow from "./TableBodyRow";

import { useDeriveMultipleSerumMarketAddresses } from '../hooks/useDeriveMultipleSerumMarketAddresses';
import { useLoadOptionsMintInfo } from '../hooks/useLoadOptionsMintInfo';
import { useLoadSerumDataByMarketAddresses } from '../hooks/useLoadSerumDataByMarketKeys';
import { calculateStrikePrecision } from '../utils/getStrikePrices';
import useSerum from '../hooks/useSerum';
import { BigNumber } from 'bignumber.js';
import { useDispatch, useSelector } from "react-redux";
import { TStore } from "../store";
import { OptionMarketWithKey } from '@mithraic-labs/psy-american';

type ChainRow = {
  key: string;
  strike: BigNumber;
  call: CallOrPut;
  put: CallOrPut;
};
let outside_serum_address : PublicKey[];
const useGetChains = (projectKey: any): ChainRow[] => {
  const { projectOption } = useSelector((state: TStore) => state.projectReducer)
  const [acc, setAcc] = useState<ChainRow[]>([]);
  // const options = useRecoilValue(selectOptionsByMarketsPageParams);
  const options_candi = projectOption[projectKey].options;
  let options: OptionMarketWithKey[] = options_candi.map((option) => option.optionMarket);
  const serumAddresses = useDeriveMultipleSerumMarketAddresses(options);
 
  outside_serum_address = serumAddresses
  const _underlyingMint = useRecoilValue(underlyingMint);
  const _quoteMint = useRecoilValue(quoteMint);
  // @ts-ignore
  const normalizeUnderlyingAmountBN = useNormalizeAmountOfMintBN(_underlyingMint);
  // @ts-ignore
  const normalizeQuoteAmountBN = useNormalizeAmountOfMintBN(_quoteMint);
  const _underlyingAmountPerContract = useRecoilValue(
    underlyingAmountPerContract,
  );
  useLoadOptionsMintInfo(options);
  useLoadSerumDataByMarketAddresses(serumAddresses);
    
  useEffect(() => {
    
    if (_underlyingMint) {
      const chainObject = options.reduce((acc, option, index) => {

        const isCall = option.underlyingAssetMint.equals(_underlyingMint);
        const normalizedContractSize = normalizeUnderlyingAmountBN(
          _underlyingAmountPerContract,
        );
        let normalizedUnderlyingAmount = normalizeUnderlyingAmountBN(
          option.underlyingAmountPerContract,
        );
        let normalizedQuoteAmount = normalizeQuoteAmountBN(
          option.quoteAmountPerContract,
        );
        if (!isCall) {
          normalizedUnderlyingAmount = normalizeQuoteAmountBN(
            option.quoteAmountPerContract,
          );
          normalizedQuoteAmount = normalizeUnderlyingAmountBN(
            option.underlyingAmountPerContract,
          );
        }

        // Must square and divide by the normalized contract size
        // in order to get the appropriate strike price
        const strike = normalizedUnderlyingAmount
          .multipliedBy(normalizedQuoteAmount)
          .div(normalizedContractSize.pow(new BigNumber(2)));
        const key = `${option.expirationUnixTimestamp}-${strike.toNumber()}`;

        const callOrPutRow = {
          ...option,
          type: isCall ? OptionType.CALL : OptionType.PUT,
          strike,
          serumMarketKey: serumAddresses[index],
          initialized: true,
        };

        acc[key] = {
          ...(acc[key] ?? {}),
          key,
          strike,
          ...(isCall ? { call: callOrPutRow } : { put: callOrPutRow }),
        } as unknown as ChainRow;

        return acc;
      }, {} as Record<string, ChainRow>);
      
      const acc = Object.values(chainObject).sort((rowA, rowB) =>
        rowA.strike.minus(rowB.strike).toNumber(),
      );
      setAcc(acc);
    }
  }, [projectKey, _underlyingMint]);
  return acc;
}

const TablePanle: React.FC<{
  project: Project;
  optionAccounts: OptionAccounts[];
  mintInfos: Record<string, MintInfoWithKey>;
  projectKey: any
}> = ({
  project,
  optionAccounts,
  mintInfos,
  projectKey
}) => {
    const [tableData, setTableData] = useState<TableData[]>([]);
    let tableData_bump: TableData[] = [];
    const [round, setRound] = useState(true);
    const { serumMarkets, fetchMultipleSerumMarkets } = useSerum();
    const writtenOptions = useWrittenOptions();
    const writtenOptionKeys = useMemo(
      () => Object.keys(writtenOptions).map((key) => new PublicKey(key)),
      [writtenOptions],
    );
    let i = 0
    const chains = useGetChains(projectKey);
    console.log('here is Okay', i++)
    let precision = 0;
        if (round && chains[0]?.strike) {
          precision = calculateStrikePrecision(chains[0].strike);
        }

    useEffect(() => {
    
      const serumKeys: SerumMarketAndProgramId[] = [];
      chains.forEach(({ call, put }) => {
        if (
          call?.serumMarketKey && !serumMarkets[call.serumMarketKey.toString()]
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
    }, [chains, fetchMultipleSerumMarkets, serumMarkets]);

    // useEffect(() => {
    //   optionAccounts.map((x, index) => {

    //     let expirationTime = new Date(x.optionMarket.expirationUnixTimestamp.toNumber() * 1000);
    //     let year = expirationTime.getFullYear();
    //     let candiMonth = expirationTime.getMonth() + 1;
    //     let month = candiMonth < 10 ? '0' + candiMonth : candiMonth;
    //     let candiDate = expirationTime.getDate()
    //     let dates = candiDate < 10 ? '0' + candiDate : candiDate;
    //     let dateTime = year + '-' + month + '-' + dates

    //     let quoteMint = mintInfos[x.optionMarket.quoteAssetMint.toString()];
    //     let underlyingMint = mintInfos[x.optionMarket.underlyingAssetMint.toString()];
    //     let optionMarket = x.optionMarket;

    //     const quoteToken = Tokens.devnet[quoteMint.pubkey.toString()];
    //     const underlyingToken = Tokens.devnet[underlyingMint.pubkey.toString()];
    //     const underTokenMainNet = Tokens.mainnet[underlyingMint.pubkey.toString()];

    //     let underlyingAmount = bnToFloat(
    //       x.optionMarket.underlyingAmountPerContract,
    //       underlyingToken.decimals,
    //       2
    //     );
    //     let strikeDisplay = formatStrike(
    //       optionMarket.underlyingAmountPerContract,
    //       optionMarket.quoteAmountPerContract,
    //       quoteToken.decimals,
    //       underlyingToken.decimals
    //     );
    //     let mintFeeAccount = x.optionMarket.mintFeeAccount.toString();
    //     let exerciseFeeAccount = x.optionMarket.exerciseFeeAccount.toString();
    //     const rowData = {
    //       expDate: dateTime,
    //       underAmount: underlyingAmount,
    //       unerSymbol: project.symbol,
    //       underLogo: project.logo,
    //       quoteAmount: strikeDisplay,
    //       quoteSymbol: quoteToken.symbol.toUpperCase(),
    //       quoteLogo: quoteToken.logoURI,
    //       mintFeeAcc: mintFeeAccount,
    //       exerciseFeeAcc: exerciseFeeAccount
    //     }
    //     tableData_bump.push(rowData);
    //   })
    //   setTableData(tableData_bump);
    // }, [])


    return (
      <div className={styles['tableDiv']}>
        <table>
          {/* <caption>Options Table</caption> */}
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Expiration</th>
              <th scope="col">Option Type</th>
              <th scope="col">Underlying Asset</th>
              <th scope="col">Contract Size</th>
              <th scope="col">Quote Asset</th>
              <th scope="col">Strike Price</th>
              <th scope="col">Mark Price</th>
              <th scope="col">Open Price</th>
              <th scope="col">Current PnL</th>
              <th scope="col">Locked Asset</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>

            {optionAccounts.map((option, index) => (
              <TableBodyRow
                key={option.optionMarket.key.toString()}
                project={project}
                optionAccount={option.optionMarket}
                optionKey={option.optionMarket.key}
                mintInfos={mintInfos}
                index={index}
                serumAddress={outside_serum_address[index]}
              />
            ))}

          </tbody>

        </table>
      </div>
    );
  };

export default TablePanle;
