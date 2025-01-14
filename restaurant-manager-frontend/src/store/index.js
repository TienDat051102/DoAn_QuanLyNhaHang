import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Import thunk không dùng {}
import rootReducer from '../store/actions/reducers';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk) // Thêm middleware thunk
);

export default store;
