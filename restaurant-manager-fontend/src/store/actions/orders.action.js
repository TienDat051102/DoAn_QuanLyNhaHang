import Api from '../../api'
import * as Types from '../../common/constants';

export const CREATE_ORDERS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.ORDERS}/createorders`,payload);
        dispatch({
            type: Types.CREATE_ORDERS_TYPE_SUCCESS,
            data: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.CREATE_ORDERS_TYPE_ERROR, data: error })
    }
    
}
export const GET_ORDERS = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.ORDERS}/listorders`);
        dispatch({
            type: Types.GET_ORDERS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.data
        })
    }
    catch(error){
        dispatch({ type: Types.GET_ORDERS_TYPE_ERROR, data: error })
    }
    
}
export const UPDATE_ORDERS_STATUS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.ORDERS}/updateorderstatus`,payload);
        dispatch({
            type: Types.UPDATE_ORDERS_STATUS_TYPE_SUCCESS,
            data: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_ORDERS_STATUS_TYPE_ERROR, data: error })
    }
    
}
export const GET_ORDERS_ID = (id) => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.ORDERS}/gettorderId/${id}`);
        dispatch({
            type: Types.GET_ORDERS_ID_TYPE_SUCCESS,
            data: response.data && response.data.data,
        })
    }
    catch(error){
        dispatch({ type: Types.GET_ORDERS_ID_TYPE_ERROR, data: error })
    }
    
}
export const UPDATE_ORDERS_ITEMS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.ORDERS}/updateorders`,payload);
        dispatch({
            type: Types.UPDATE_ORDERSITEMS_TYPE_SUCCESS,
            data: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_ORDERSITEMS_TYPE_ERROR, data: error })
    }
    
}
