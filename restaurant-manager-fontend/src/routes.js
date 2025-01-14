import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin";
import React,{ Component } from "react";
import Discounts from "./pages/table/discounts";

class MainRoute extends Component {
    render() {
        return (
            <Routes>
              <Route path='/' element={<Dashboard />} ></Route>
              <Route path='/discounts' element={<Discounts />} ></Route>
            </Routes>
        );
    }
}

export {MainRoute};