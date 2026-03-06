import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BreadcrumbProvider } from './layout/Breadcrumb'; 
import MainLayout from './layout/Main';
import Home from './pages/home/Home';
import KostList from '../src/pages/ListKost';

const App = () => {
    // Jika tujuannya langsung ke List Kost, kita arahkan ke /kost
    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <BreadcrumbProvider> 
                <Routes>
                    {/* 1. Redirect root langsung ke /kost */}
                    <Route path="/" element={<Navigate to="/kost" replace />} />

                    {/* 2. Grouping Route dengan Layout */}
                    <Route element={<MainLayout />}>
                        <Route path="/kost" element={<KostList />} />
                        
                        <Route 
                            path="/home-vendor" 
                            element={<div>Halaman Vendor</div>} 
                        />
                    </Route>

                    {/* 3. Catch-all: arahkan ke /kost jika path tidak ditemukan */}
                    <Route path="*" element={<Navigate to="/kost" replace />} />
                </Routes>
            </BreadcrumbProvider>
        </BrowserRouter>
    );
};

export default App;