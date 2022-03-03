import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatedProjectKey } from "../slices/projectSlice"
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { Account, MintInfoWithKey, OptionAccounts, Project } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { TStore } from "../store";
import { isConstructorDeclaration } from "typescript";
import { OptionMarketWithKey } from '@mithraic-labs/psy-american';
import { Tokens } from "@mithraic-labs/psy-token-registry";
import { formatExpirationTimestamp } from '../utils/format';
import { useNormalizedStrikePriceFromOption } from '../hooks/useNormalizedStrikePriceFromOption';
import { useOptionIsCall } from '../hooks/useOptionIsCall';

const IndividualOption: React.FC<{
  option: OptionAccounts;
  mintInfos: Record<string, MintInfoWithKey>;
}> = ({
  option,
  mintInfos
}) => {
  const dispatch = useDispatch();
  const { projectKey } = useSelector((state: TStore) => state.projectReducer)
  
  let quoteMint = mintInfos[option.optionMarket.quoteAssetMint.toString()];
  let underlyingMint = mintInfos[option.optionMarket.underlyingAssetMint.toString()];
  const quoteToken = Tokens.devnet[quoteMint.pubkey.toString()];
  const underlyingToken = Tokens.devnet[underlyingMint.pubkey.toString()];

  const isCall = useOptionIsCall(option.optionMarket);
  const strike = useNormalizedStrikePriceFromOption(
    underlyingMint,
    quoteMint,
    option.optionMarket,
    isCall,
  );
  const currentDate = new Date().getTime();
  const isExpired = option.optionMarket.expirationUnixTimestamp.toNumber()*1000 < currentDate?true:false;

  console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', quoteToken)
  console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM', option.optionMarket)
  return (
    
      <div className={styles["project-card-container"]} style={{minWidth:'30%', marginBottom:'20px', borderLeft: '5px solid #05a823'}}>
        <div className={styles["project-card-title"]}>
          <div className={styles['project-logo']} style={{marginRight:'0px'}}>
            <img src={underlyingToken.logoURI} style={{width:'30px', height:'30px'}}/>
          </div>
          <span>&nbsp;---&nbsp;</span>
          <div className={styles['project-logo']}>
            <img src={quoteToken.logoURI} style={{width:'30px', height:'30px'}}/>
          </div>
          <span className={styles['project-title']}>{underlyingToken.symbol.toString()} - {quoteToken.symbol.toUpperCase()} </span>
        </div>
        <div className={styles['project-card-body']}>
          <p className={styles['project-description']}>&nbsp;</p>
          <p>Option Type : &nbsp; {isCall ? 'Call' : 'Put'}</p>
          <p>Strike Price : &nbsp;$ {strike.toString()}</p>
          <p >Expiration Date : &nbsp; "{formatExpirationTimestamp(option.optionMarket?.expirationUnixTimestamp.toNumber())}"</p>
          {isExpired == true?(
            <p style={{color : '#fd7b7b'}}>Expired</p>
          ):null}
        </div>
        {isExpired == true ? (
          <Link to={`/`}>
            <div className={styles['toExercise']}>
                Exercise
            </div>
          </Link>
        ):null} 
      </div>
    
  );
};

export default IndividualOption;
