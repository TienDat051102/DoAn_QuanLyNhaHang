import * as Types from '../../../common/constants';

const INITIAL_STATE = {
  discounts: [],
  discountsCount: 0,
};

function discountsReducer(state = INITIAL_STATE,action){
    switch(action.type){
        case Types.GET_DISCOUNTS_TYPE_SUCCESS:{
            return{
                ...state,
                discounts: action.data,
                discountsCount: action.count
            }
        }
        case Types.UPDATE_DISCOUNTS_TYPE_SUCCESS:{
            return{
                ...state,
                discounts: action.data
            }
        }
        case Types.DELETE_DISCOUNTS_TYPE_SUCCESS:{
            return{
                ...state,
                discounts: action.data
            }
        }
        case Types.GET_ACTIVE_DISCOUNTS_TYPE_SUCCESS:{
            return{
                ...state,
                discounts: action.data
            }
        }
        default: return state;
    }

}

export default discountsReducer;