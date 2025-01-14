import Api from '../../api'
import * as Types from '../../common/constants';
export const GET_CUSTOMER = (payload) => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.CUSTOMERS}/listcustomer`,{params: payload});
        dispatch({
            type: Types.GET_CUSTOMERS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.count,
        })
    }
    catch(error){
        dispatch({ type: Types.GET_CUSTOMERS_TYPE_ERROR, data: error })
    }
}
export const UPDATE_CUSTOMER = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.CUSTOMERS}/updatecustomer`, payload);
        dispatch({
            type: Types.UPDATE_CUSTOMERS_TYPE_SUCCESS,
            data: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_CUSTOMERS_TYPE_ERROR, data: error })
    }
}