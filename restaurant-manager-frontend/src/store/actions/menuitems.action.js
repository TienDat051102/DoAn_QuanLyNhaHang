import Api from '../../api'
import * as Types from '../../common/constants';

export const GET_MENUITEMS =(payload) => async (dispatch) =>{
    try{
        const response = await Api.get(`${Types.MENUITEMS}/getmenuitems`, {params: payload})
        dispatch({
            type: Types.GET_MENUITEMS_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.count
        })
    }
    catch(error){
        dispatch({ type: Types.GET_MENUITEMS_TYPE_ERROR, data: error })
    }
}

export const UPDATE_MENUITEMS =(payload) => async (dispatch) =>{
    try{
        const response = await Api.post(`${Types.MENUITEMS}/updatemenuitems`,  payload)
        dispatch({
            type: Types.UPDATE_MENUITEMS_TYPE_SUCCESS,
            message: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_MENUITEMS_TYPE_ERROR, data: error })
    }
}