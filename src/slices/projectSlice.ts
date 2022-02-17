import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MintInfoWithKey, ProjectOptions, Account } from "../types";

interface ProjectState {
    projectOption : Record<string, ProjectOptions>,
    account : Account,
    mintInfo : Record<string, MintInfoWithKey>
}
const initialState : ProjectState = {
    projectOption : <Record<string, ProjectOptions>>{},
    account : <Account>{pubKey: ''},
    mintInfo : <Record<string, MintInfoWithKey>>{}
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
        }
    },
  });

export const projectReducer = projectSlice.reducer;
export const { updatedProjectOption, updatedAccount, updatedMintInfo } = projectSlice.actions;
