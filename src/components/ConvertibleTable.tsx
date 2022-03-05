import React from "react";
import { useEffect, useState, useMemo } from "react";

import { MintInfoWithKey, OptionAccounts, Project, TableData, SerumMarketAndProgramId, CallOrPut, OptionType, TotalItems } from "../types";

import styles from "../styles/PortfolioOverview.module.scss";

import TableBodyRow from "./TableBodyRow";


const ConvertibleTablePanle: React.FC<{
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
    

    return (
      <div className={styles['tableDiv']} style={{marginTop:2}}>
        <table>
          {/* <caption>Options Table</caption> */}
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Convertible</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">Expiration</th>
              <th scope="col">Principal(Cost)</th>
              <th scope="col">Interest</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="No"> 1</td>
              <td data-label="Convertible">CPN-47</td>
              <td data-label="Type">Convertible Debt</td>
              <td data-label="Status"> Outstanding</td>
              <td data-label="Expiration"> {'2022-02-28'}</td>
              <td data-label="Principal">$365</td>
              <td data-label="Interest">$150</td>
            </tr>
            <tr>
              <td data-label="No">2</td>
              <td data-label="Convertible">CPN-56</td>
              <td data-label="Type">Convertible Debt</td>
              <td data-label="Status">OutStanding</td>
              <td data-label="Expiration">2022-03-05</td>
              <td data-label="Principal">$485</td>
              <td data-label="Interest">$220</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{fontSize:'0.85em'}}>
              <td colSpan={5}> Total </td>
              <td data-label="originGrant">$850</td>
              <td data-label="vestedOption">$370</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

export default ConvertibleTablePanle;
