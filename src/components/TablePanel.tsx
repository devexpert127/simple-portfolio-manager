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
    <div>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>No</th>
            <th rowSpan={2}>Exp Date</th>
            <th colSpan={2}>Underlying Asset</th>
            <th colSpan={2}>Quote Asset</th>
            <th rowSpan={2}>Mint Fee Account</th>
            <th rowSpan={2}>Exercise Fee Account</th>
          </tr>
          <tr>
            <th>Amount</th>
            <th>Symbol</th>
            <th>Amount</th>
            <th>Symbol</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((tdata, idx)=>(
            <tr>
              <td>{idx}</td>
              <td>{tdata.expDate}</td>
              <td>{tdata.underAmount}</td>
              <td>{tdata.unerSymbol}&nbsp;&nbsp;&nbsp;<img src={tdata.underLogo} style={{width:'20px', height:"20px"}}/></td>
              <td>{tdata.quoteAmount}</td>
              <td>{tdata.quoteSymbol}&nbsp;&nbsp;&nbsp;<img src={tdata.quoteLogo} style={{width:'20px', height:"20px"}}/></td>
              <td>{tdata.mintFeeAcc}</td>
              <td>{tdata.exerciseFeeAcc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePanle;
