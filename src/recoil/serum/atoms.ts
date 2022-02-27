import { OpenOrders } from '@project-serum/serum';
import { atomFamily } from 'recoil';
import { PriceFromOrdering } from '../../types'

// OpenOrders can have multiple per Serum market
/**
 * Array of OpenOrder accounts keyed by option publickey.
 *
 * This could be optimized by storing a mapping from the
 * option to the OpenOrder so we can iterate over users OpenOrders
 * opposed to all the option.
 */
export const openOrdersByOptionKey = atomFamily<OpenOrders[], string>({
  key: 'openOrdersByOptionKey',
  default: [],
});

export const priceByAssets = atomFamily<PriceFromOrdering, string>({
  key: 'priceByAssets',
  default: {
            price : 0,
            openPrice:0
            },
});
