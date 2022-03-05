import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { priceByAssets } from '../recoil';
import { getPriceFromSerumOrderbook, getOpenPriceFromSerumOrderbook } from '../utils/orderbook';
import { findMarketByAssets } from '../utils/serum';
import useConnection from './useConnection';
import useSerum from './useSerum';
import { useSerumOrderbook } from './useSerumOrderbook';
import { useSubscribeSerumOrderbook } from './useSubscribeSerumOrderook';
import { PriceFromOrdering } from '../types';

/**
 * Look up price of a serum market based on the base asset and quote asset.
 * @param baseMint
 * @param quoteMint
 * @returns number
 */
export const useSerumPriceByAssets = (
  baseMint: PublicKey | string | null,
  quoteMint: PublicKey | string | null,
  serumaddress:PublicKey,
): PriceFromOrdering  => {
  // console.log('underlying mint is ', baseMint, '\nquote mint is ', quoteMint, '\nserum Address is ',serumaddress)
  const { connection, dexProgramId } = useConnection();

  const { setSerumMarkets } = useSerum();
  const [serumMarketAddress, setSerumMarketAddress] =
    useState<PublicKey | null>(serumaddress);
    // setSerumMarketAddress(serumaddress)
  const baseMintStr =
    baseMint instanceof PublicKey ? baseMint.toString() : baseMint;
  const quoteMintStr =
    baseMint instanceof PublicKey ? baseMint.toString() : baseMint;
  const [price, setPrice] = useRecoilState(
    priceByAssets(`${baseMintStr}-${quoteMintStr}`),
  );

  const { orderbook: underlyingOrderbook } = useSerumOrderbook(
    serumaddress?.toString() ?? '',
  );
  
  // useSubscribeSerumOrderbook(serumaddress?.toString() ?? '');

  useEffect(() => {
    
    if (!baseMint || !quoteMint || !dexProgramId) {
      
      return;
    }
   
    (async () => {
      const baseMintKey =
        typeof baseMint === 'string' ? new PublicKey(baseMint) : baseMint;
      const quoteMintKey =
        typeof quoteMint === 'string' ? new PublicKey(quoteMint) : quoteMint;
        
      const market = await findMarketByAssets(
        connection,
        baseMintKey,
        quoteMintKey,
        dexProgramId,
      );
      console.log('===========================================================================================================', market)
      if (!market) {
        
        return;
      } 
      
      setSerumMarkets((_markets) => ({
        ..._markets,
        [market.address.toString()]: {
          serumMarket: market,
          serumProgramId: dexProgramId?.toString(),
        },
      }));
      setSerumMarketAddress(market.address);
    })();
    
    
  }, [baseMint, connection, dexProgramId, quoteMint, setSerumMarkets]);

  useEffect(() => {
    console.log('Serum Market Address is ',serumMarketAddress)
    console.log('Underlying der book is ', underlyingOrderbook)
    if (underlyingOrderbook) {
      const _price = getPriceFromSerumOrderbook(underlyingOrderbook);
      const _openPrice = getOpenPriceFromSerumOrderbook(underlyingOrderbook)
      setPrice({
        price: _price ?? 0,
        openPrice : _openPrice ?? 0
      });
    }
  }, [setPrice, underlyingOrderbook]);

  return price;
};


