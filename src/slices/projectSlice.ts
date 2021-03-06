import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MintInfoWithKey, ProjectOptions, Account } from "../types";
import { Program, Provider } from "@project-serum/anchor";

import { PsyAmericanIdl } from "@mithraic-labs/psy-american";
import { PublicKey } from "@solana/web3.js";


interface ProjectState {
    projectOption : Record<string, ProjectOptions>,
    account : Account,
    mintInfo : Record<string, MintInfoWithKey>,
    projectKey : string,
    grantNumber : number
    // programRe : Program
}
const initialState : ProjectState = {
    projectOption : <Record<string, ProjectOptions>>{},
    account : <Account>{pubKey: ''},
    mintInfo : <Record<string, MintInfoWithKey>>{},
    projectKey : <string>'psyoptions',
    grantNumber:<number>15636,
    // programRe : new Program(
    //     PsyAmericanIdl,
    //     new PublicKey("R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs"),
    // )
}

type TPROPayload = {
    projectOption : Record<string, ProjectOptions>;
}

type TACCPayload = {
    account : Account;
}

type TMINTPayload ={
    mintInfo : Record<string, MintInfoWithKey>
}

type PROJECTPayload = {
    projectKey : string
}
type GRNUMPayload = {
    grantNumber : number
}


export const projectSlice = createSlice({
    name: 'projectSlice',
    initialState,
    reducers: {
        updatedProjectOption : (state, { payload : projectOption } : PayloadAction<TPROPayload>)=>{
            state.projectOption = projectOption.projectOption;
        },
        updatedAccount : (state, { payload : acc } : PayloadAction<TACCPayload>)=>{
            state.account = acc.account;
        },
        updatedMintInfo : (state, { payload : mi } : PayloadAction<TMINTPayload>)=>{
            state.mintInfo = mi.mintInfo;
        },
        updatedProjectKey : (state, { payload : pk } : PayloadAction<PROJECTPayload>)=>{
            state.projectKey = pk.projectKey;
        },

        updatedGrantNumber : (state, { payload : gn } : PayloadAction<GRNUMPayload>)=>{
            state.grantNumber = gn.grantNumber;
        },
    },
  });

export const projectReducer = projectSlice.reducer;
// export const { updatedProjectOption, updatedAccount, updatedMintInfo, updatedProgram } = projectSlice.actions;
export const { updatedProjectOption, updatedAccount, updatedMintInfo, updatedProjectKey, updatedGrantNumber } = projectSlice.actions;
