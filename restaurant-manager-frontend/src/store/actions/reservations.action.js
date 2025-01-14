import Api from '../../api'
import * as Types from '../../common/constants';
export const GET_RESERVATION = (payload) => async (dispatch) =>{
    try{
        const response = await Api.get(`${Types.RESERVATION}/listreservations`, {params: payload});
        dispatch({
            type: Types.GET_RESERVATION_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.count
        })
    }
    catch(error){
        dispatch({ type: Types.GET_RESERVATION_TYPE_ERROR, data: error })
    }
}
export const GET_LIST_RESERVATION = (payload) => async (dispatch) =>{
    try{
        const response = await Api.get(`${Types.RESERVATION}/getreservations`, {params: payload});
        dispatch({
            type: Types.GET_LIST_RESERVATION_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.count
        })
    }
    catch(error){
        dispatch({ type: Types.GET_LIST_RESERVATION_TYPE_ERROR, data: error })
    }
}
export const UPDATE_RESERVATION = (payload) => async (dispatch) =>{
    try{
        const response = await Api.post(`${Types.RESERVATION}/updatereservations`, payload);
        dispatch({
            type: Types.UPDATE_RESERVATION_TYPE_SUCCESS,
            data: response.data && response.data.data,
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_RESERVATION_TYPE_ERROR, data: error })
    }
}
export const ACCEPT_RESERVATION = (payload) => async (dispatch) =>{
    try{
        const response = await Api.post(`${Types.RESERVATION}/acceptreservations`, payload);
        dispatch({
            type: Types.ACCEPT_RESERVATION_TYPE_SUCCESS,
            data: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.ACCEPT_RESERVATION_TYPE_ERROR, data: error })
    }
}
export const CREATE_RESERVATION = (payload) => async (dispatch) =>{
    try{
        const response = await Api.post(`${Types.RESERVATION}/createreservations`, payload);
        dispatch({
            type: Types.CREATE_RESERVATION_TYPE_SUCCESS,
            data: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.CREATE_RESERVATION_TYPE_ERROR, data: error })
    }
}