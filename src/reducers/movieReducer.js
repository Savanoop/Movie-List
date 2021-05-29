import { LoginTypes } from "../const/ActionTypes";

const INITIAL_STATE = {
  items: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case LoginTypes.GET_MOVIES_LOADING:
      return { ...state, loading: true };

    case LoginTypes.GET_MOVIES_SUCCESS:
      return { ...state, items: payload, loading: false };

    default:
      return state;
  }
};
