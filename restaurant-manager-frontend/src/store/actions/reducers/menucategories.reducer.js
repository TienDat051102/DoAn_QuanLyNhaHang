import * as Types from '../../../common/constants';
const INITIAL_STATE = {
    menuCateGories: [],
    menuCateGoriesCount: 0,
    message: ''
};
function menucategoriesReducer(state = INITIAL_STATE,action){
    switch(action.type){
        case Types.GET_MENUCATEGORIES_TYPE_SUCCESS:{
            return{
                ...state,
                menuCateGories: action.data,
                menuCateGoriesCount: action.count
            }
        }
        case Types.GET_ALL_MENUCATEGORIES_TYPE_SUCCESS:{
            return{
                ...state,
                menuCateGories: action.data,
                menuCateGoriesCount: action.count
            }
        }
        case Types.DELETE_MENUCATEGORIES_TYPE_SUCCESS:{
            console.log('action',action)
            return{
                ...state,
                message: action.message
            }
        }
        case Types.UPDATE_MENUCATEGORIES_TYPE_SUCCESS:{
            console.log('action',action)
            return{
                ...state,
                message: action.message
            }
        }
        default: return state;
    }
}
export default menucategoriesReducer;