import React, { useState, useEffect } from 'react';
import { Layout, Typography } from 'antd';
import LayoutMenu from './Menu';
import LayoutLogo from '../layout/Logo';
import { 
    getUserRole, 
    isAdminOrOwner, 
    getSessionData,
    isAuthenticated,
    clearUserSession
} from '../components/Global/Formatter';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

const LayoutSidebar = ({ collapsed, onCollapse }) => {
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    const sidebarColor = '#001529';
    const textColor = 'rgba(255, 255, 255, 0.85)';

    useEffect(() => {
        const checkAccess = () => {
            try {
                console.log('=== Sidebar: Checking access ===');
                
                // 1. Cek apakah user terautentikasi menggunakan fungsi dari formatter
                const authStatus = isAuthenticated();
                console.log('Sidebar: Is authenticated:', authStatus);

                if (!authStatus) {
                    console.log('Sidebar: User not authenticated');
                    setHasAccess(false);
                    setUserRole(null);
                    setLoading(false);
                    return;
                }

                // 2. Dapatkan role user
                const role = getUserRole();
                console.log('Sidebar: User role:', role);
                setUserRole(role);

                // 3. Cek apakah user memiliki akses sebagai Admin/Owner
                const access = isAdminOrOwner();
                console.log('Sidebar: Has admin/owner access:', access);
                setHasAccess(access);

            } catch (error) {
                console.error('Sidebar: Error checking access:', error);
                setHasAccess(false);
                setUserRole(null);
                
                // Jika terjadi error, bersihkan session yang corrupt
                clearUserSession();
            } finally {
                setLoading(false);
            }
        };

        checkAccess();

        // Optional: Listen untuk perubahan storage (jika ada tab lain yang mengubah session)
        const handleStorageChange = (e) => {
            if (e.key === 'session' || e.key === 'user' || e.key === 'token') {
                console.log('Sidebar: Storage changed, rechecking access...');
                checkAccess();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Jika loading, tampilkan skeleton
    if (loading) {
        return (
            <Sider
                width={280}
                collapsedWidth="80"
                collapsed={collapsed}
                style={{
                    backgroundColor: sidebarColor,
                    minHeight: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                }}
            >
                <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '16px'
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTop: '3px solid #1890ff',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                        Loading...
                    </Text>
                    <style>
                        {`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}
                    </style>
                </div>
            </Sider>
        );
    }

    // Jika tidak punya akses (bukan Admin/Owner), tampilkan sidebar terbatas
    if (!hasAccess) {
        return (
            <Sider
                width={280}
                collapsedWidth="80"
                collapsed={collapsed}
                style={{
                    backgroundColor: sidebarColor,
                    minHeight: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                }}
            >
                <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '12px'
                }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        background: 'rgba(24, 144, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#1890ff'
                    }}>
                        {userRole ? userRole.charAt(0).toUpperCase() : '?'}
                    </div>
                    
                    {!collapsed && (
                        <>
                            <Text strong style={{ color: 'white', fontSize: 14 }}>
                                {userRole || 'User'}
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, textAlign: 'center' }}>
                                Anda tidak memiliki akses ke menu admin
                            </Text>
                            <Text style={{ 
                                color: 'rgba(255,255,255,0.3)', 
                                fontSize: 11, 
                                textAlign: 'center',
                                marginTop: 8
                            }}>
                                Role: {userRole || 'Not Assigned'}
                            </Text>
                        </>
                    )}
                    
                    {collapsed && (
                        <Text style={{ 
                            color: 'rgba(255,255,255,0.3)', 
                            fontSize: 10,
                            writingMode: 'vertical-rl',
                            letterSpacing: 2
                        }}>
                            NO ACCESS
                        </Text>
                    )}
                </div>
            </Sider>
        );
    }

    // Tampilkan sidebar lengkap untuk Admin/Owner
    return (
        <Sider
            width={280}
            breakpoint="lg"
            collapsedWidth="80"
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            style={{
                backgroundColor: sidebarColor,
                minHeight: '100vh',
                position: 'sticky',
                top: 0,
                left: 0,
                boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
                transition: 'all 0.2s',
                zIndex: 99,
                overflow: 'hidden'
            }}
            trigger={null}
        >
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                overflow: 'hidden'
            }}>
                {/* Logo Section */}
                <div style={{
                    padding: collapsed ? '16px 0' : '20px 24px',
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: 16,
                    flexShrink: 0
                }}>
                    {!collapsed ? (
                        <LayoutLogo />
                    ) : (
                        <div style={{
                            width: 40,
                            height: 40,
                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                        }}>
                            K
                        </div>
                    )}
                </div>

                {/* User Info (Collapsed) */}
                {collapsed && (
                    <div style={{
                        padding: '8px 0',
                        textAlign: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        marginBottom: 8
                    }}>
                        <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(24, 144, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            fontSize: 14,
                            color: '#1890ff',
                            fontWeight: 'bold'
                        }}>
                            {userRole?.charAt(0) || 'A'}
                        </div>
                    </div>
                )}

                {/* Menu Section */}
                <div style={{ 
                    flex: 1, 
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '0 4px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255,255,255,0.1) transparent'
                }}>
                    <LayoutMenu />
                </div>

                {/* Footer Section */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    fontSize: 12,
                    color: textColor,
                    textAlign: 'center',
                    flexShrink: 0,
                    background: 'rgba(0,0,0,0.1)'
                }}>
                    {!collapsed ? (
                        <div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                gap: 16,
                                marginBottom: 4
                            }}>
                                <span style={{ opacity: 0.7 }}>© 2024</span>
                                <span style={{ color: '#1890ff' }}>KostManager</span>
                            </div>
                            <div style={{ 
                                fontSize: 10, 
                                opacity: 0.4,
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 12
                            }}>
                                <span>v1.0.0</span>
                                <span>•</span>
                                <span>{userRole || 'Admin'}</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            width: 24,
                            height: 24,
                            margin: '0 auto',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color: 'rgba(255,255,255,0.2)'
                        }}>
                            K
                        </div>
                    )}
                </div>
            </div>
        </Sider>
    );
};

export default LayoutSidebar;