import { activeNetwork, quoteMint } from '../recoil';
import { serumUtils, OptionMarketWithKey } from '@mithraic-labs/psy-american';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAmericanPsyOptionsProgram } from './useAmericanPsyOptionsProgram';
import { getSupportedMarketsByNetwork } from '../utils/networkInfo';

export const useDeriveMultipleSerumMarketAddresses = (
  options: OptionMarketWithKey[],
): PublicKey[] => {
  const network = useRecoilValue(activeNetwork);
  const [serumMarketKeys, setSerumMarketKeys] = useState<PublicKey[]>([]);
  const program = useAmericanPsyOptionsProgram();

  useEffect(() => {
   
    const marketMetaOptions = getSupportedMarketsByNetwork(network.name);
    console.log('Marekt Meta Options are ', marketMetaOptions);
    (async () => {
      const deriveSerumAddressesPromises = options.map(async (option) => {
        // Check if the option exists in the market meta package first. This is for backwards
        // compatibility and could eventually be removed when the market meta package is no
        // longer needed.
        const serumMarketAddress = marketMetaOptions.find(
          (optionMarketWithKey) =>
            optionMarketWithKey.optionMarketAddress === option.key.toString(),
        )?.serumMarketAddress;
        if (serumMarketAddress) {
          return new PublicKey(serumMarketAddress);
        }
        // @ts-ignore
        const [address] = await serumUtils.deriveSerumMarketAddress(program, option.key, );
        return address;
      });
      
      const derivedAddresses = await Promise.all(deriveSerumAddressesPromises);
 
      setSerumMarketKeys(derivedAddresses);
    })();
  
  }, [ network]);

  return serumMarketKeys;
};
