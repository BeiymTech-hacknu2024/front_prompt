import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";

const rootReducer = combineReducers({
  darkTheme: themeReducer,
});

export default rootReducer;
