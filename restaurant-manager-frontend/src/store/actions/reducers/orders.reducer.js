import * as Types from '../../../common/constants';

const INITIAL_STATE = {
  order: [],
  ordersCount: 0,
  message: ''
};
function ordersReducer(state= INITIAL_STATE,action){
    switch(action.type){
        case Types.CREATE_ORDERS_TYPE_SUCCESS:{
            return{
                ...state,
                order: action.data,
            }
        }
        case Types.GET_ORDERS_TYPE_SUCCESS:{
            return{
                ...state,
                order: action.data,
                ordersCount: action.count
            }
        }
        case Types.UPDATE_ORDERS_STATUS_TYPE_SUCCESS:{
            return{
                ...state,
                order: action.data,
                ordersCount: action.count
            }
        }
        case Types.GET_ORDERS_ID_TYPE_SUCCESS:{
            return{
                ...state,
                order: action.data,
            }
        }
        case Types.UPDATE_ORDERSITEMS_TYPE_SUCCESS:{
            return{
                ...state,
                message: action.data
            }
        }
        default: return state;
    }
}

export default ordersReducer;