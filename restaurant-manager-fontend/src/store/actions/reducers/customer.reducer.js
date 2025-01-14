import * as Types from "../../../common/constants";

const INITIAL_STATE = {
  customers: [],
  customersCount: 0,
  message: "",
};

function customerReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.GET_CUSTOMERS_TYPE_SUCCESS:
      return {
        ...state,
        customers: action.data,
        customersCount: action.count,
      };
    case Types.UPDATE_CUSTOMERS_TYPE_SUCCESS:
      return {
        ...state,
        message: action.data,
      };
    default:
      return state;
  }
}
export default customerReducer;
