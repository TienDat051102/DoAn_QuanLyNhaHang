import Api from '../../api'
import * as Types from '../../common/constants';
export const GET_MENUCATEGORIES = (payload) => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.MENUCATEGORIES}/listmenucategories`, {params: payload});
        dispatch({
            type: Types.GET_MENUCATEGORIES_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.datacount
        })
    }
    catch(error){
        dispatch({ type: Types.GET_MENUCATEGORIES_TYPE_ERROR, data: error })
    }
}
export const GET_ALL_MENUCATEGORIES = (payload) => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.MENUCATEGORIES}/getmenucategories`, {params: payload});
        dispatch({
            type: Types.GET_ALL_MENUCATEGORIES_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.datacount
        })
    }
    catch(error){
        dispatch({ type: Types.GET_ALL_MENUCATEGORIES_TYPE_ERROR, data: error })
    }
}

export const DELETE_MENUCATEGORIES = (payload) => async (dispatch)=>{
    try{
        const id = payload
        if(!id){
            dispatch({ type: Types.DELETE_DISCOUNTS_TYPE_ERROR})
        }
        const response = await Api.post(`${Types.MENUCATEGORIES}/deletemenucategories`, id);
        dispatch({
            type: Types.DELETE_MENUCATEGORIES_TYPE_SUCCESS,
            message: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.DELETE_MENUCATEGORIES_TYPE_ERROR, data: error })
    }
}

export const UPDATE_MENUCATEGORIES = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.MENUCATEGORIES}/updatemenucategories`,  payload);
        dispatch({
            type: Types.GET_ALL_MENUCATEGORIES_TYPE_SUCCESS,
            message: response.data && response.data.message
        })
    }
    catch(error){
        dispatch({ type: Types.GET_ALL_MENUCATEGORIES_TYPE_ERROR, data: error })
    }
}