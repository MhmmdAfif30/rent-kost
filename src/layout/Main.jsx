import React, { useState, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import LayoutSidebar from './Sidebar';
import LayoutHeader from './Header';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAccess = () => {
        const session = localStorage.getItem('session');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const roleName = userData?.role_name || '';
        const access = roleName === "Admin" || roleName === "Owner" || roleName === "Super Admin";
        
        console.log('Checking access:', { session: !!session, roleName, access });
        setHasAccess(access);
        setIsLoading(false);
        return access;
    };

    useEffect(() => {
        // Cek akses saat pertama load
        checkAccess();

        // Event listener untuk authChange (dari login/logout)
        const handleAuthChange = () => {
            console.log('AuthChange event received');
            checkAccess();
        };

        // Event listener untuk storage changes (dari tab lain)
        const handleStorageChange = (e) => {
            if (e.key === 'session' || e.key === 'user') {
                console.log('Storage changed:', e.key);
                checkAccess();
            }
        };

        window.addEventListener('authChange', handleAuthChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleCollapse = (value) => {
        setCollapsed(value);
    };

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <Spin size="large" tip="Memuat..." />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {hasAccess && (
                <LayoutSidebar collapsed={collapsed} onCollapse={handleCollapse} />
            )}
            <Layout>
                <LayoutHeader 
                    collapsed={collapsed} 
                    onCollapse={handleCollapse} 
                    hasAccess={hasAccess}
                />
                <Content style={{ 
                    margin: 0,
                    padding: 0,
                    background: '#f0f2f5',
                    minHeight: 'calc(100vh - 64px)'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;