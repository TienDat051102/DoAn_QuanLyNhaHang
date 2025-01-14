import * as Types from '../../../common/constants';

const INITIAL_STATE = {
  menuitems: [],
  menuitemsCount: 0,
  message: ''
};

function menuitemsReducer(state = INITIAL_STATE,action){
    switch(action.type){
        case Types.GET_MENUITEMS_TYPE_SUCCESS: {
            return{
                ...state,
                menuitems: action.data,
                menuitemsCount: action.count
            }
        }
        case Types.UPDATE_MENUITEMS_TYPE_SUCCESS: {
            return{
                ...state,
                message: action.message
            }
        }
        default: return state;
    }
}

export default menuitemsReducer
