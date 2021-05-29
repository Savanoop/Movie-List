import { LoginTypes } from "../const/ActionTypes";
import { getMovies } from "../services/movieServices";


export const getMoviesDetails = () => {
  return dispatch => {
    dispatch({
      type: LoginTypes.GET_MOVIES_LOADING
    });
    return getMovies().then(movies => {    
      dispatch({
        payload: movies,
        type: LoginTypes.GET_MOVIES_SUCCESS
      });
    });
  };
};