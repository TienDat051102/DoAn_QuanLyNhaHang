import Api from '../../api'
import * as Types from '../../common/constants';

export const GET_INGREDIENTS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.INGREDIENTS}/listingredients`, {params: payload});
        dispatch({
            type: Types.GET_INGREDIENTS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.count
        })
    }
    catch(error){
        dispatch({ type: Types.GET_INGREDIENTS_TYPE_ERROR, data: error })
    }
}
export const UPDATE_INGREDIENTS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.INGREDIENTS}/updateingredients`, payload);
        dispatch({
            type: Types.UPDATE_INGREDIENTS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            message: response.data && response.data.message
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_INGREDIENTS_TYPE_ERROR, data: error })
    }
}
export const DELETE_INGREDIENTS = (payload) => async (dispatch)=>{
    try{
        const id = payload
        if(!id){
            dispatch({ type: Types.DELETE_INGREDIENTS_TYPE_ERROR})
        }
        const response = await Api.post(`${Types.INGREDIENTS}/deleteingredients`, id);
        dispatch({
            type: Types.DELETE_INGREDIENTS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            message: response.data && response.data.message
        })
    }
    catch(error){
        dispatch({ type: Types.DELETE_INGREDIENTS_TYPE_ERROR, data: error })
    }
}

export const UPDATE_EXPIRED_INGREDIENTS = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.INGREDIENTS}/checkAndUpdateIngredients`);
        dispatch({
            type: Types.UPDATE_EXPIRED_INGREDIENTS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            message: response.data && response.data.message
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_EXPIRED_INGREDIENTS_TYPE_ERROR, data: error })
    }
}

export const CHECK_INGREDIENTS = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.INGREDIENTS}/checkingredients`);
        dispatch({
            type: Types.CHECK_INGREDIENTS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            message: response.data && response.data.message
        })
    }
    catch(error){
        dispatch({ type: Types.CHECK_INGREDIENTS_TYPE_ERROR, data: error })
    }
}
export const UPDATE_VALIDATE_INGREDIENTS = (payload) => async (dispatch)=>{
    try{
        console.log('payload',payload)
        const response = await Api.post(`${Types.INGREDIENTS}/addvalidateingredients`,payload);
        dispatch({
            type: Types.UPDATE_VALIDATE_INGREDIENTS_TYPE_SUCCESS,
            message: response.data && response.data.message
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_VALIDATE_INGREDIENTS_TYPE_ERROR, data: error })
    }
}