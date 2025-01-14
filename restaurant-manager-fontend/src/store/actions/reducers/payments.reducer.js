import * as Types from '../../../common/constants';

const INITIAL_STATE = {
    payments: [],
    paymentsCount: 0,
    message:''
}
function paymentsReducer(state = INITIAL_STATE,action){
    switch(action.type){
        case Types.CREATE_PAYMENTS_TYPE_SUCCESS:{
            return{
                ...state,
                message: action.message
            }
        }
        default:
            return state;
    }
}

export default paymentsReducer