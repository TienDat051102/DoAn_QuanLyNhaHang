import Api from '../../api'
import * as Types from '../../common/constants';

export const GET_DISCOUNTS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.DISCOUNTS}/listdiscounts`, {params: payload});
        dispatch({
            type: Types.GET_DISCOUNTS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.count
        })
    }
    catch(error){
        dispatch({ type: Types.GET_DISCOUNTS_TYPE_ERROR, data: error })
    }
}
export const UPDATE_DISCOUNTS = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.DISCOUNTS}/updatediscounts`, payload);
        dispatch({
            type: Types.UPDATE_DISCOUNTS_TYPE_SUCCESS,
            data: response.data && response.data.data,
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_DISCOUNTS_TYPE_ERROR, data: error })
    }
}
export const DELETE_DISCOUNTS = (payload) => async (dispatch)=>{
    try{
        const id = payload
        if(!id){
            dispatch({ type: Types.DELETE_DISCOUNTS_TYPE_ERROR})
        }
        const response = await Api.post(`${Types.DISCOUNTS}/deletediscounts`, id);
        dispatch({
            type: Types.DELETE_DISCOUNTS_TYPE_SUCCESS,
            data: response.data && response.data.data,
        })
    }
    catch(error){
        dispatch({ type: Types.DELETE_DISCOUNTS_TYPE_ERROR, data: error })
    }
}
export const GET_ACTIVE_DISCOUNTS = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.DISCOUNTS}/getActiveDiscounts`);
        dispatch({
            type: Types.GET_ACTIVE_DISCOUNTS_TYPE_SUCCESS,
            data: response.data && response.data.data,
        })
    }
    catch(error){
        dispatch({ type: Types.GET_ACTIVE_DISCOUNTS_TYPE_ERROR, data: error })
    }
}