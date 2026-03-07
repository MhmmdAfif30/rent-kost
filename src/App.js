import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BreadcrumbProvider } from "./layout/Breadcrumb";
import MainLayout from "./layout/Main";

import Home from "./pages/home/Home";

import KostList from "../src/pages/ListKost";
import DetailKost from "./pages/DetailKost";

const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <BreadcrumbProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/kost" element={<KostList />} />
            <Route path="/detail-kost/:id" element={<DetailKost />} />
          </Route>
        </Routes>
      </BreadcrumbProvider>
    </BrowserRouter>
  );
};

export default App;
