import exampleReducer from "./exampleReducer";
import authReducer from "./auth";
import { combineReducers } from "redux";

const allReducer = combineReducers({
  example: exampleReducer,
  auth: authReducer,
});

export default allReducer;