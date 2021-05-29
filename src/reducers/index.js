import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import movieReducer from "./movieReducer";



const rootReducers = combineReducers({
  loginReducer,
  movieReducer
});

export default rootReducers;
