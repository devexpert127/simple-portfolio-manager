import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { displayHeader } from "../lib/optionMarketUtils";
import { MintInfoWithKey, OptionAccounts, Project } from "../types";

const OptionOverview: React.FC<{
  project: Project;
  optionAccounts: OptionAccounts;
  mintInfos: Record<string, MintInfoWithKey>;
}> = ({ optionAccounts, project, mintInfos }) => {
  return (
    <Card>
      {
        console.log('111111111', project, '\n 22222222', optionAccounts.optionMarket, '\n 33333333333', mintInfos[optionAccounts.optionMarket.underlyingAssetMint.toString()], '\n 44444444444444', mintInfos[optionAccounts.optionMarket.quoteAssetMint.toString()])
      }
      <CardContent>
        {displayHeader(
          project,
          optionAccounts.optionMarket, 
          mintInfos[optionAccounts.optionMarket.underlyingAssetMint.toString()],
          mintInfos[optionAccounts.optionMarket.quoteAssetMint.toString()]
        )}
      </CardContent>
    </Card>
  );
};

export default OptionOverview;
