import * as Types from "../../../common/constants";

const INITIAL_STATE = {
  ingredients: [],
  ingredientsCount: 0,
  message: "",
  error: "",
  expiredIngredients: [],
  validateIngredients: []
};

function ingredientsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.GET_INGREDIENTS_TYPE_SUCCESS: {
      return {
        ...state,
        ingredients: action.data,
        ingredientsCount: action.count,
        message: action.message,
      };
    }
    case Types.UPDATE_INGREDIENTS_TYPE_SUCCESS: {
      return {
        ...state,
        ingredients: action.data,
        message: action.message,
      };
    }
    case Types.DELETE_INGREDIENTS_TYPE_SUCCESS: {
      return {
        ...state,
        ingredients: action.data,
        message: action.message,
      };
    }
    case Types.UPDATE_EXPIRED_INGREDIENTS_TYPE_SUCCESS: {
      return {
        ...state,
        expiredIngredients: action.data,
        message: action.message
      }
    }
    case Types.CHECK_INGREDIENTS_TYPE_SUCCESS: {
      return {
        ...state,
        validateIngredients: action.data,
      }
    }
    case Types.UPDATE_VALIDATE_INGREDIENTS_TYPE_SUCCESS: {
      return {
        ...state,
        message: action.message,
      }
    }
    default:
      return state;
  }
}
export default ingredientsReducer;
