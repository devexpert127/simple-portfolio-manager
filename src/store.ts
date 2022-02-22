import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer/reducer";

export const store = configureStore({ 
    reducer ,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});
export type TStore = ReturnType<typeof store.getState>;