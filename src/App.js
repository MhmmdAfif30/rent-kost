import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BreadcrumbProvider } from "./layout/Breadcrumb";

import MainLayout from "./layout/Main";

import Home from "./pages/home/Home";
import KostList from "../src/pages/kost/ListKost";
import DetailKost from "./pages/kost/DetailKost";
import Login from "./pages/auth/Signin";
import ListPembayaran from "./pages/finance/ListPembayaran";

const App = () => {
    return (
        <BrowserRouter>
            <BreadcrumbProvider> {/* Wrap all routes with BreadcrumbProvider */}
                <Routes>
                    {/* Public Routes (tanpa layout) */}
                    <Route path="/signin" element={<Login />} />

                    {/* Routes dengan MainLayout (sidebar + header) */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Navigate to="/kost" replace />} />
                        <Route path="kost" element={<KostList />} />
                        <Route path="detail-kost/:id" element={<DetailKost />} />
                        <Route path="list-pembayaran" element={<ListPembayaran />} />
                        <Route path="home" element={<Home />} />
                    </Route>

                    {/* Fallback 404 */}
                    <Route path="*" element={<Navigate to="/kost" replace />} />
                </Routes>
            </BreadcrumbProvider>
        </BrowserRouter>
    );
};

export default App;