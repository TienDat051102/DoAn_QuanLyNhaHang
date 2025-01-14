import Api from '../../api'
import * as Types from '../../common/constants';
export const GET_USERS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.USERS}/getuserlist`, {params: payload});
        dispatch({
            type: Types.GET_USERS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.count
        })
    }
    catch(error){
        dispatch({ type: Types.GET_USERS_TYPE_ERROR, data: error })
    }
}
export const UPDATE_USERS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.USERS}/updateusers`, payload);
        dispatch({
            type: Types.UPDATE_USERS_TYPE_SUCCESS,
            data: response.data && response.data.data,
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_USERS_TYPE_ERROR, data: error })
    }
}
export const DELETE_USERS = (payload) => async (dispatch)=>{
    try{
        const id = payload
        if(!id){
            dispatch({ type: Types.DELETE_USERS_TYPE_ERROR})
        }
        const response = await Api.post(`${Types.USERS}/deleteusers`, id);
        dispatch({
            type: Types.DELETE_USERS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.count
        })
    }
    catch(error){
        dispatch({ type: Types.DELETE_USERS_TYPE_ERROR, data: error })
    }
}

export const CREATE_USERS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.USERS}/createuser`, payload);
        dispatch({
            type: Types.CREATE_USERS_TYPE_SUCCESS,
            message: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.CREATE_USERS_TYPE_ERROR, data: error })
    }
}

export const CHANG_PASSWORD = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.USERS}/changpassword`, payload);
        dispatch({
            type: Types.CREATE_USERS_TYPE_SUCCESS,
            message: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.CREATE_USERS_TYPE_ERROR, data: error })
    }
}