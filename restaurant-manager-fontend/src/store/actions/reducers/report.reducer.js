import * as Types from '../../../common/constants';

const INITIAL_STATE = {
    revenueByMonth: [],
    countOrdersByMonth: [],
    revenueByCategory: [],
    countOrdersToday: [],
    revenueOrdersToday: [],
    countCustomerThisYear: [],
    orderCancellationRate: [],
    recentOrders: [],
    topSelling: [],
}

function reportReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case Types.REPORTS_REVENUE_BY_MONTH_TYPE_SUCCESS: {
            return {
                ...state,
                revenueByMonth: action.data
            };
        }
        case Types.REPORTS_COUNT_ORDERS_BY_MONTH_TYPE_SUCCESS: {
            return {
                ...state,
                countOrdersByMonth: action.data
            };
        }
        case Types.REPORTS_REVENUE_BY_CATEGORY_TYPE_SUCCESS: {
            return {
                ...state,
                revenueByCategory: action.data
            };
        }
        case Types.REPORTS_COUNT_ORDERS_TODAY_TYPE_SUCCESS: {
            return {
                ...state,
                countOrdersToday: action.data
            };
        }
        case Types.REPORTS_REVENUE_ORDERS_TODAY_TYPE_SUCCESS: {
            return {
                ...state,
                revenueOrdersToday: action.data
            };
        }
        case Types.REPORTS_COUNT_CUSTOMER_THIS_YEAR_TYPE_SUCCESS: {
            return {
                ...state,
                countCustomerThisYear: action.data
            };
        }
        case Types.REPORTS_ORDER_CANCELLATION_RATE_TYPE_SUCCESS: {
            return{
                ...state,
                orderCancellationRate: action.data
            }
        }
        case Types.REPORTS_ORDER_RECENT_TYPE_SUCCESS:{
            return{
                ...state,
                recentOrders: action.data
            }
        }
        case Types.REPORTS_TOP_SELLING_TYPE_SUCCESS:{
            return{
                ...state,
                topSelling: action.data
            }
        }
        default:
            return state;
    }
}

export default reportReducer;
