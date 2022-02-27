import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { priceByAssets } from '../recoil';
import { getPriceFromSerumOrderbook } from '../utils/orderbook';
import { findMarketByAssets } from '../utils/serum';
import useConnection from './useConnection';
import useSerum from './useSerum';
import { useSerumOrderbook } from './useSerumOrderbook';
import { useSubscribeSerumOrderbook } from './useSubscribeSerumOrderook';

/**
 * Look up price of a serum market based on the base asset and quote asset.
 * @param baseMint
 * @param quoteMint
 * @returns number
 */
export const useSerumPriceByAssets = (
  baseMint: PublicKey | string | null,
  quoteMint: PublicKey | string | null,
  // program : Program | null
): number  => {
  const { connection, dexProgramId } = useConnection();
  const { setSerumMarkets } = useSerum();
  const [serumMarketAddress, setSerumMarketAddress] =
    useState<PublicKey | null>(new PublicKey('FsEBBfyVUgC92K3hB2GQywv56vsUgYjGgDARoeDLxUyn'));
  const baseMintStr =
    baseMint instanceof PublicKey ? baseMint.toString() : baseMint;
  const quoteMintStr =
    baseMint instanceof PublicKey ? baseMint.toString() : baseMint;
  const [price, setPrice] = useRecoilState(
    priceByAssets(`${baseMintStr}-${quoteMintStr}`),
  );

  const { orderbook: underlyingOrderbook } = useSerumOrderbook(
    serumMarketAddress?.toString() ?? '',
  );

  useSubscribeSerumOrderbook(serumMarketAddress?.toString() ?? '');

  useEffect(() => {
  
    if (!baseMint || !quoteMint || !dexProgramId) {
      setPrice(0);
      return;
    }
    (async () => {
      const baseMintKey =
        typeof baseMint === 'string' ? new PublicKey(baseMint) : baseMint;
      const quoteMintKey =
        typeof quoteMint === 'string' ? new PublicKey(quoteMint) : quoteMint;
      console.log("Base mint key is ", baseMintKey.toString(), "\nquote mint key is ", quoteMintKey.toString())
      const market = await findMarketByAssets(
        connection,
        baseMintKey,
        quoteMintKey,
        dexProgramId,
      );
      if (!market) {
        setPrice(0)
        return;
      } 
      setSerumMarkets((_markets) => ({
        ..._markets,
        [market.address.toString()]: {
          serumMarket: market,
          serumProgramId: dexProgramId?.toString(),
        },
      }));
      // const marketAddress = new PublicKey('FsEBBfyVUgC92K3hB2GQywv56vsUgYjGgDARoeDLxUyn');
      // const optionProgramKey  = new PublicKey('R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs')
      setSerumMarketAddress(market.address);
    })();
    // console.log('Serum marketaddress is ', serumMarketAddress)
  }, [baseMint, connection, dexProgramId, quoteMint, setSerumMarkets]);

  useEffect(() => {
    // console.log('Underlying Order book is ', underlyingOrderbook)
    if (underlyingOrderbook) {
      const _price = getPriceFromSerumOrderbook(underlyingOrderbook);
      // console.log('the value of PriceByAssets is ', _price)
      setPrice(_price ?? 0);
    }
  }, [setPrice, underlyingOrderbook]);

  return price;
};
