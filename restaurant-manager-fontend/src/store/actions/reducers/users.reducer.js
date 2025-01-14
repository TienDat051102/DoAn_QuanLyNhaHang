import * as Types from '../../../common/constants';

const INITIAL_STATE = {
  users: [],
  usersCount: 0,
  message: ''
};
function usersReducer(state = INITIAL_STATE,action){
    switch(action.type){
        case Types.GET_USERS_TYPE_SUCCESS:{
            return{
                ...state,
                users: action.data,
                usersCount: action.count
            }
        }
        case Types.UPDATE_USERS_TYPE_SUCCESS:{
            return{
                ...state,
                users: action.data,
                usersCount: action.count
            }
        }
        case Types.DELETE_USERS_TYPE_SUCCESS:{
            return{
                ...state,
                users: action.data,
                usersCount: action.count
            }
        }
        case Types.CREATE_USERS_TYPE_SUCCESS:{
            return{
                ...state,
                message: action.message
            }
        }
        case Types.CHANG_PASSWORD_USERS_TYPE_SUCCESS:{
            return{
                ...state,
                message: action.message
            }
        }
        default: return state;
    }
}
export default usersReducer;