import { combineReducers } from 'redux';
import discountsReducer from './discounts.reducer';
import usersReducer from './users.reducer';
import menucategoriesReducer from './menucategories.reducer';
import tableReducer from './table.reducer';
import ordersReducer from './orders.reducer';
import menuitemsReducer from './menuitems.reducer';
import reservationReducer from './reservations.reducer';
import customerReducer from './customer.reducer';
import paymentsReducer from './payments.reducer';
import reportReducer from './report.reducer';
import ingredientsReducer from './ingredients.reducer';



const rootReducer = combineReducers({
    discountsReducer: discountsReducer, 
    usersReducer: usersReducer, 
    menucategoriesReducer: menucategoriesReducer,
    tableReducer: tableReducer,
    ordersReducer: ordersReducer,
    menuitemsReducer: menuitemsReducer,
    reservationReducer: reservationReducer,
    customerReducer: customerReducer,
    paymentsReducer: paymentsReducer,
    reportReducer: reportReducer,
    ingredientsReducer: ingredientsReducer,
});


export default rootReducer;