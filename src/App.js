import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BreadcrumbProvider } from "./layout/Breadcrumb";
import MainLayout from "./layout/Main";

import Home from "./pages/home/Home";

//KOST
import KostList from "../src/pages/kost/ListKost";
import DetailKost from "./pages/kost/DetailKost";

import Login from "./pages/auth/Signin"



const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/kost" replace />} />
                <Route path="/signin" element={<Login />} />

                <Route path="/kost" element={<KostList />} />
                <Route path="/detail-kost/:id" element={<DetailKost />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
