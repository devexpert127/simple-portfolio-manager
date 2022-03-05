import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Link } from 'react-router-dom';
import { OptionMarket } from "@mithraic-labs/psy-american";
import { Tokens } from "@mithraic-labs/psy-token-registry";
import { bnToFloat, formatStrike } from "../lib/utils";

import { MintInfoWithKey, OptionAccounts, Project, TableData, SerumMarketAndProgramId, CallOrPut, OptionType, TotalItems } from "../types";
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
  console.log('Serum addresses are ', serumAddresses);
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
  }, [projectKey, _underlyingMint, _quoteMint]);
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
    const [round, setRound] = useState(true);
    const { serumMarkets, fetchMultipleSerumMarkets } = useSerum();
    const writtenOptions = useWrittenOptions();
    const writtenOptionKeys = useMemo(
      () => Object.keys(writtenOptions).map((key) => new PublicKey(key)),
      [writtenOptions],
    );

    let i = 0
    const chains = useGetChains(projectKey);
    let precision = 0;
        if (round && chains[0]?.strike) {
          precision = calculateStrikePrecision(chains[0].strike);
        }
    const { grantNumber } = useSelector((state: TStore) => state.projectReducer)
    let sumGrant = 0;
    let sumVested = 0;
    let sumExercised =0;
    let sumExerciseable = 0;
    const calculateItem = (idx : number) : TotalItems => {
      const deviationArr =  [0.24, 0.28, 0.46, 0.18];
      const vestMulNumber = [0.75, 0.8, 0.9, 1];
      const exeMulNumber = [0.64, 0.56, 0.48, 0.84];
      const averageValue = Math.round(grantNumber/optionAccounts.length);
      const mulNumber = (idx+1)%2==1?1:(-1);
      const arrIndex = Math.floor((idx%8)/2);
      const originGrant = Math.round(averageValue* (1 + mulNumber*deviationArr[arrIndex]));
      sumGrant = sumGrant + originGrant
      const vestedOption = Math.round(originGrant * vestMulNumber[(idx%4)]);
      sumVested = sumVested + vestedOption
      const excercisedOption = Math.round(vestedOption * exeMulNumber[idx%4]);
      sumExercised = sumExercised + excercisedOption
      const exerciseableOption = vestedOption - excercisedOption;
      sumExerciseable = sumExerciseable + exerciseableOption;
      const total : TotalItems={
        granted : originGrant,
        vested : vestedOption,
        exercised : excercisedOption,
        exerciseable : exerciseableOption
      }
      return total
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

    return (
      <div className={styles['tableDiv']}>
        <table>
          {/* <caption>Options Table</caption> */}
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Option</th>
              <th scope="col">Expiration</th>
              <th scope="col">Option Type</th>
              <th scope="col">Origin Grant</th>
              <th scope="col">Vested</th>
              <th scope="col">Exercised</th>
              <th scope="col">Exercisable</th>
              <th scope="col">Strike Price</th>
            </tr>
          </thead>

          <tbody>

            {optionAccounts.map((option, index) => (
              <>
                <TableBodyRow
                  key={option.optionMarket.key.toString()}
                  project={project}
                  optionAccount={option.optionMarket}
                  optionKey={option.optionMarket.key}
                  mintInfos={mintInfos}
                  index={index}
                  serumAddress={outside_serum_address[index]}
                  totalitems = {calculateItem(index)}
                />
              </>
            ))}
            </tbody>
            <tfoot>
              <tr style={{fontSize:'0.85em'}}>
                <td colSpan={4}> Total </td>
                <td data-label="originGrant"> {sumGrant}</td>
                <td data-label="vestedOption"> {sumVested}</td>
                <td data-label="exercisedOtion"> {sumExercised}</td>
                <td data-label="exerciseableOption"> {sumExerciseable}</td>
                <td data-label="StrikePrice">&nbsp;</td>
              </tr>
            </tfoot>
        </table>
      </div>
    );
  };

export default TablePanle;
