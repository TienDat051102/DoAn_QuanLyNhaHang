import Api from '../../api'
import * as Types from '../../common/constants';
export const GET_EMPTYTABLE = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.TABLE}/emptytable`);
        dispatch({
            type: Types.GET_EMPTYTABLE_TYPE_SUCCESS,
            data: response.data && response.data.data,
        })
    }
    catch(error){
        dispatch({ type: Types.GET_EMPTYTABLE_TYPE_ERROR, data: error })
    }
}

export const GET_TABLE = (payload) => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.TABLE}/listtables`,{params:payload});
        dispatch({
            type: Types.GET_TABLE_TYPE_SUCCESS,
            data: response.data && response.data.data,
            count: response.data && response.data.count
        })
    }
    catch(error){
        dispatch({ type: Types.GET_TABLE_TYPE_ERROR, data: error })
    }
}

export const UPDATE_STATUS_TABLE = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.TABLE}/updatestatus`,payload);
        dispatch({
            type: Types.UPDATE_STATUS_TABLE_TYPE_SUCCESS,
            data: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_STATUS_TABLE_TYPE_ERROR, data: error })
    }
}

export const DELETE_TABLE = (id) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.TABLE}/deletetables`,id);
        dispatch({
            type: Types.DELETE_TABLE_TYPE_SUCCESS,
            data: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.DELETE_TABLE_TYPE_ERROR, data: error })
    }
}

export const UPDATE_TABLE = (payload) => async (dispatch)=>{
    try{
        const response = await Api.post(`${Types.TABLE}/updatetables`,payload);
        dispatch({
            type: Types.UPDATE_TABLE_TYPE_SUCCESS,
            data: response.data && response.data.message,
        })
    }
    catch(error){
        dispatch({ type: Types.UPDATE_TABLE_TYPE_ERROR, data: error })
    }
}