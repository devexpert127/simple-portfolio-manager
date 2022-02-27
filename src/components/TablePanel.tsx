import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Link } from 'react-router-dom';
import { OptionMarket } from "@mithraic-labs/psy-american";
import { Tokens } from "@mithraic-labs/psy-token-registry";
import { bnToFloat, formatStrike } from "../lib/utils";

import { MintInfoWithKey, OptionAccounts, Project, TableData } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";
import { PublicKey } from '@solana/web3.js';
import { useRecoilValue } from 'recoil';
import { optionsMap } from '../recoil';
import { useWrittenOptions } from '../hooks/useWrittenOptions';
import { useOpenPositions } from '../hooks/useOpenPositions';
import { useNormalizeAmountOfMintBN } from '../hooks/useNormalizeAmountOfMintBN';
import TableBodyRow from "./TableBodyRow";

const TablePanle: React.FC<{
  project : Project;
  optionAccounts: OptionAccounts[];
  mintInfos: Record<string, MintInfoWithKey>;
}> = ({
  project,
  optionAccounts,
  mintInfos
}) => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  let tableData_bump : TableData[]=[];

  const writtenOptions = useWrittenOptions();
  const writtenOptionKeys = useMemo(
    () => Object.keys(writtenOptions).map((key) => new PublicKey(key)),
    [writtenOptions],
  );

    
   useEffect(() => {
    optionAccounts.map((x, index)=>{
      
      let expirationTime = new Date(x.optionMarket.expirationUnixTimestamp.toNumber() * 1000);
      let year = expirationTime.getFullYear();
      let candiMonth = expirationTime.getMonth() + 1;
      let month = candiMonth<10?'0'+candiMonth:candiMonth;
      let candiDate = expirationTime.getDate()
      let dates = candiDate<10?'0'+candiDate:candiDate;
      let dateTime  = year +'-'+ month + '-' + dates
  
      let quoteMint = mintInfos[x.optionMarket.quoteAssetMint.toString()];
      let underlyingMint = mintInfos[x.optionMarket.underlyingAssetMint.toString()];
      let optionMarket = x.optionMarket;
  
      const quoteToken = Tokens.devnet[quoteMint.pubkey.toString()];
      const underlyingToken = Tokens.devnet[underlyingMint.pubkey.toString()];
      const underTokenMainNet = Tokens.mainnet[underlyingMint.pubkey.toString()];
  
      let underlyingAmount = bnToFloat(
        x.optionMarket.underlyingAmountPerContract,
        underlyingToken.decimals,
        2
      );
      let strikeDisplay = formatStrike(
        optionMarket.underlyingAmountPerContract,
        optionMarket.quoteAmountPerContract,
        quoteToken.decimals,
        underlyingToken.decimals
      );
      let mintFeeAccount = x.optionMarket.mintFeeAccount.toString();
      let exerciseFeeAccount = x.optionMarket.exerciseFeeAccount.toString();
      const rowData ={
        expDate : dateTime,
        underAmount : underlyingAmount,
        unerSymbol : project.symbol,
        underLogo : project.logo,
        quoteAmount : strikeDisplay,
        quoteSymbol : quoteToken.symbol.toUpperCase(),
        quoteLogo : quoteToken.logoURI,
        mintFeeAcc : mintFeeAccount,
        exerciseFeeAcc : exerciseFeeAccount
      }
      tableData_bump.push(rowData);
    })
    setTableData(tableData_bump);
  },[])


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
              optionKey = {option.optionMarket.key}
              mintInfos={mintInfos}
              index={index}
            />
          ))}
           
        </tbody>
       
      </table>
    </div>
  );
};

export default TablePanle;
