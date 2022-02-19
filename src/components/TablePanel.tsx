import React from "react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { OptionMarket } from "@mithraic-labs/psy-american";
import { Tokens } from "@mithraic-labs/psy-token-registry";
import { bnToFloat, formatStrike } from "../lib/utils";

import { MintInfoWithKey, OptionAccounts, Project, TableData } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";

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
    // <div className={styles['tableDiv']}>
      <table>
        <caption>Options Table</caption>
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Exp Date</th>
            <th scope="col">Underling Amount</th>
            <th scope="col">Underling Symbol</th>
            <th scope="col">Quote Amount</th>
            <th scope="col">Quote Symbol</th>
            <th scope="col">Mint Fee Account</th>
            <th scope="col">Exercise Fee Account</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((tdata, idx)=>(
            <tr key={idx}>
              {idx==0?(<td data-label="ID">{idx + 1}</td>):
              <td data-label="ID" scope="row">{idx + 1}</td>}
              <td data-label="ExpDate">{tdata.expDate}</td>
              <td data-label="UnderAmount">{tdata.underAmount}</td>
              <td data-label="UnderSymbol">{tdata.unerSymbol}&nbsp;&nbsp;&nbsp;<img src={tdata.underLogo} style={{width:'20px', height:"20px"}}/></td>
              <td data-label="QuoteAmount">{tdata.quoteAmount}</td>
              <td data-label="QuoteSymbol">{tdata.quoteSymbol}&nbsp;&nbsp;&nbsp;<img src={tdata.quoteLogo} style={{width:'20px', height:"20px"}}/></td>
              <td data-label="MintFee"><div className={styles['addressTd']}>{tdata.mintFeeAcc}</div></td>
              <td data-label="ExerFee"><div className={styles['addressTd']}>{tdata.exerciseFeeAcc}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    // </div>
  );
};

export default TablePanle;
