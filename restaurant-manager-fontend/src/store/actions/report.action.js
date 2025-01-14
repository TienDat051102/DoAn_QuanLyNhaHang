import Api from '../../api'
import * as Types from '../../common/constants';

export const REVENUE_BY_MONTH = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.REPORTS}/revenuebymonth`);
        dispatch({
             type: Types.REPORTS_REVENUE_BY_MONTH_TYPE_SUCCESS,
             data: response.data && response.data.data
        })
    }
     catch(error){
            dispatch({ type: Types.REPORTS_REVENUE_BY_MONTH_TYPE_ERROR, data: error })
        }
}

export const COUNT_ORDERS_BY_MONTH = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.REPORTS}/monthlycount`);
        dispatch({
             type: Types.REPORTS_COUNT_ORDERS_BY_MONTH_TYPE_SUCCESS,
             data: response.data && response.data.data
        })
    }
     catch(error){
            dispatch({ type: Types.REPORTS_COUNT_ORDERS_BY_MONTH_TYPE_ERROR, data: error })
        }
}

export const REVENUE_BY_CATEGORY = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.REPORTS}/revenuebycategory`);
        dispatch({
             type: Types.REPORTS_REVENUE_BY_CATEGORY_TYPE_SUCCESS,
             data: response.data && response.data.data
        })
    }
     catch(error){
            dispatch({ type: Types.REPORTS_REVENUE_BY_CATEGORY_TYPE_ERROR, data: error })
        }
}

export const COUNT_ORDERS_TODAY = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.REPORTS}/countorderstoday`);
        dispatch({
             type: Types.REPORTS_COUNT_ORDERS_TODAY_TYPE_SUCCESS,
             data: response.data && response.data.data
        })
    }
     catch(error){
            dispatch({ type: Types.REPORTS_COUNT_ORDERS_TODAY_TYPE_ERROR, data: error })
        }
}

export const REVENUE_ORDERS_TODAY = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.REPORTS}/revenueordertoday`);
        dispatch({
             type: Types.REPORTS_REVENUE_ORDERS_TODAY_TYPE_SUCCESS,
             data: response.data && response.data.data
        })
    }
     catch(error){
            dispatch({ type: Types.REPORTS_REVENUE_ORDERS_TODAY_TYPE_ERROR, data: error })
        }
}

export const COUNT_CUSTOMER_THIS_YEAR = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.REPORTS}/countcustomerthisyear`);
        dispatch({
             type: Types.REPORTS_COUNT_CUSTOMER_THIS_YEAR_TYPE_SUCCESS,
             data: response.data && response.data.data
        })
    }
     catch(error){
            dispatch({ type: Types.REPORTS_COUNT_CUSTOMER_THIS_YEAR_TYPE_ERROR, data: error })
        }
}

export const ORDER_CANCELLATION_RATE = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.REPORTS}/ordercancellationrate`);
        dispatch({
             type: Types.REPORTS_ORDER_CANCELLATION_RATE_TYPE_SUCCESS,
             data: response.data && response.data.data
        })
    }
     catch(error){
            dispatch({ type: Types.REPORTS_ORDER_CANCELLATION_RATE_TYPE_ERROR, data: error })
        }
}

export const ORDERS_RECENT = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.REPORTS}/recentorders`);
        dispatch({
             type: Types.REPORTS_ORDER_RECENT_TYPE_SUCCESS,
             data: response.data && response.data.data
        })
    }
     catch(error){
            dispatch({ type: Types.REPORTS_ORDER_RECENT_TYPE_ERROR, data: error })
        }
}

export const TOP_SELLING = () => async (dispatch)=>{
    try{
        const response = await Api.get(`${Types.REPORTS}/bestsellingproducts`);
        dispatch({
             type: Types.REPORTS_TOP_SELLING_TYPE_SUCCESS,
             data: response.data && response.data.data
        })
    }
     catch(error){
            dispatch({ type: Types.REPORTS_TOP_SELLING_TYPE_ERROR, data: error })
        }
}