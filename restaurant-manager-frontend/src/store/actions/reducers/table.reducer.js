import * as Types from "../../../common/constants";

const INITIAL_STATE = {
  table: [],
  tableCount: 0,
  message: "",
};

function tableReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.GET_EMPTYTABLE_TYPE_SUCCESS:
      return {
        ...state,
        table: action.data,
      };
    case Types.GET_TABLE_TYPE_SUCCESS:
      return {
        ...state,
        table: action.data,
        tableCount: action.count,
      };
    case Types.UPDATE_STATUS_TABLE_TYPE_SUCCESS:
      return {
        ...state,
      };
    case Types.DELETE_TABLE_TYPE_SUCCESS:
      return {
        ...state,
        message: action.data,
      };
    case Types.UPDATE_TABLE_TYPE_SUCCESS:
      return {
        ...state,
        message: action.data,
      };
    default:
      return state;
  }
}
export default tableReducer;
