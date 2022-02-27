import {
  Keypair,
  PublicKey,
  Connection,

} from '@solana/web3.js';

import { Market } from '@mithraic-labs/psyoptions';

export const findMarketByMarketAddress = (
  connection: Connection,
 
): Market | null => {

  
    const marketAddress = new PublicKey('FsEBBfyVUgC92K3hB2GQywv56vsUgYjGgDARoeDLxUyn');
    const optionProgramKey  = new PublicKey('R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs')
    connection.getAccountInfo(marketAddress).then((result)=>{
      const myMarket = new Market(
        optionProgramKey,
        marketAddress,
        // @ts-ignore
        result?.data
      )
      console.log('My market is ', myMarket)
      return myMarket;
    });
    
    return null
  }
  



