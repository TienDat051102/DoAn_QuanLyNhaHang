import * as Types from "../../../common/constants";

const INITIAL_STATE = {
  reservations: [],
  reservationsCount: 0,
  message: ''
};

function reservationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.GET_RESERVATION_TYPE_SUCCESS:
      return {
        ...state,
        reservations: action.data,
        reservationsCount: action.data.count,
      };
    case Types.UPDATE_RESERVATION_TYPE_SUCCESS:
      return {
        ...state,
        reservations: action.data,
      };
    case Types.GET_LIST_RESERVATION_TYPE_SUCCESS: {
      return {
        ...state,
        reservations: action.data,
        reservationsCount: action.count,
      };
    }
    case Types.ACCEPT_RESERVATION_TYPE_SUCCESS: {
      return{
        ...state,
        message: action.data
      }
    }
    case Types.CREATE_RESERVATION_TYPE_SUCCESS: {
      return{
        ...state,
        message: action.data
      }
    }
    default:
      return state;
  }
}
export default reservationReducer;
