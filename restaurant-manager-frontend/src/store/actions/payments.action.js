import Api from '../../api'
import * as Types from '../../common/constants';

export const CREATE_PAYMENTS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.PAYMENTS}/createpayments`,payload);
        dispatch({
            type: Types.CREATE_PAYMENTS_TYPE_SUCCESS,
            message: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.CREATE_PAYMENTS_TYPE_ERROR, data: error })
    }
}