import { PublicKey } from '@solana/web3.js';
import { useRecoilValue, atomFamily, atom } from 'recoil';
import { optionsMap } from '../recoil';
import useAssetList from './useAssetList';
import { OptionMarket, OptionMarketWithKey } from '@mithraic-labs/psy-american'

/*
  PAI's mainnet public key. This could be improved by keeping 
  track of stables in the token registry.
*/
const PAI_KEY = new PublicKey('Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS');

/**
 * Determine whether or not the option is a Call or Put.
 * Note: this should be used in contexts where we do not
 * know the appropriate underlying asset (i.e. showing
 * all options instead of just BTC options).
 */
export const useOptionIsCall = (option: OptionMarketWithKey): boolean => {
  const { USDCPublicKey } = useAssetList();
  // const option = useRecoilValue(optionsMap(optionKey.toString()));

  if (!USDCPublicKey || !option) {
    return true;
  }

  return (
    !option.underlyingAssetMint.equals(USDCPublicKey) &&
    !option.underlyingAssetMint.equals(PAI_KEY)
  );
};
