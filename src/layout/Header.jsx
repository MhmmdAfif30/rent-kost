import React, { useState, useEffect } from 'react';
import { Layout, theme, Space, Typography, Breadcrumb, Button, Input, Select, Badge, Avatar, Dropdown, Divider } from 'antd';
import {
    UserOutlined,
    PlusOutlined,
    SearchOutlined,
    BellOutlined,
    SettingOutlined,
    LogoutOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { useBreadcrumb } from './Breadcrumb';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    getSessionData, 
    getUserData, 
    isAdminOrOwner as checkIsAdminOrOwner,
    clearUserSession,
    isAuthenticated
} from '../components/Global/Formatter'; // Sesuaikan path

const { Text } = Typography;
const { Header } = Layout;
const { Option } = Select;

const LayoutHeader = ({ collapsed, onCollapse }) => {
    const { breadcrumbItems } = useBreadcrumb();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState("");
    const [filterTipe, setFilterTipe] = useState(null);
    const [filterHarga, setFilterHarga] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const {
        token: { colorBgContainer, colorBorder, colorText, colorPrimary },
    } = theme.useToken();

    useEffect(() => {
        // Debug: Cek semua localStorage
        console.log('=== HEADER DEBUG ===');
        console.log('All localStorage keys:', Object.keys(localStorage));
        console.log('session exists:', !!localStorage.getItem('session'));
        console.log('user exists:', !!localStorage.getItem('user'));
        console.log('token exists:', !!localStorage.getItem('token'));
        
        // Cek authentication menggunakan fungsi dari formatter
        const authStatus = isAuthenticated();
        console.log('Header: Is authenticated:', authStatus);
        
        if (authStatus) {
            // Ambil data user dari session
            const session = getSessionData();
            console.log('Header: Session data:', session);
            
            if (session && !session.error) {
                setIsLoggedIn(true);
                // Ambil user data dari session
                if (session.user) {
                    setUserData(session.user);
                    console.log('Header: User data from session:', session.user);
                } else {
                    // Jika user tidak ada di session, coba dari localStorage
                    const user = getUserData();
                    if (user) {
                        setUserData(user);
                        console.log('Header: User data from getUserData:', user);
                    }
                }
            }
        } else {
            // Coba fallback ke localStorage user
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const userObj = JSON.parse(user);
                    setUserData(userObj);
                    setIsLoggedIn(true);
                    console.log('Header: User data from localStorage fallback:', userObj);
                } catch (error) {
                    console.error('Header: Error parsing user data:', error);
                    setUserData(null);
                    setIsLoggedIn(false);
                }
            } else {
                setUserData(null);
                setIsLoggedIn(false);
            }
        }
        setLoading(false);
    }, []);

    // Log setiap kali userData berubah
    useEffect(() => {
        console.log('Header: userData updated:', userData);
        console.log('Header: isLoggedIn:', isLoggedIn);
    }, [userData, isLoggedIn]);

    const isKostListPage = location.pathname === '/kost-list' || location.pathname === '/' || location.pathname === '/kost';

    // Gunakan fungsi isAdminOrOwner dari formatter
    const isAdminOrOwner = () => {
        return checkIsAdminOrOwner();
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        window.dispatchEvent(new CustomEvent('kostFilterChange', {
            detail: { searchText: e.target.value, filterTipe, filterHarga }
        }));
    };

    const handleTipeChange = (value) => {
        setFilterTipe(value);
        window.dispatchEvent(new CustomEvent('kostFilterChange', {
            detail: { searchText, filterTipe: value, filterHarga }
        }));
    };

    const handleHargaChange = (value) => {
        setFilterHarga(value);
        window.dispatchEvent(new CustomEvent('kostFilterChange', {
            detail: { searchText, filterTipe, filterHarga: value }
        }));
    };

    const handleLogout = () => {
        clearUserSession();
        navigate('/signin', { replace: true });
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profil Saya',
            onClick: () => navigate('/profile')
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Pengaturan',
            onClick: () => navigate('/settings')
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Keluar',
            danger: true,
            onClick: handleLogout
        },
    ];

    const notificationItems = [
        {
            key: '1',
            label: (
                <div style={{ width: 300 }}>
                    <Text strong>Pesan Baru</Text>
                    <div style={{ fontSize: 12, color: '#666' }}>Tidak ada notifikasi baru</div>
                </div>
            ),
        },
    ];

    // Ambil data untuk ditampilkan
    const displayName = userData?.fullname || userData?.name || userData?.username || 'Guest';
    const displayRole = userData?.role_name || userData?.role || 'Not Logged In';
    const userAvatar = userData?.avatar || null;

    // Jika loading, tampilkan skeleton atau null
    if (loading) {
        return null;
    }

    return (
        <>
            <Header
                style={{
                    background: colorBgContainer,
                    padding: "0 24px",
                    height: "auto",
                    minHeight: "auto",
                    boxSizing: 'border-box',
                    borderBottom: `1px solid ${colorBorder}`,
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    flexWrap: 'wrap',
                    gap: 16
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => onCollapse(!collapsed)}
                            style={{ fontSize: 16 }}
                        />
                        <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                background: `linear-gradient(135deg, ${colorPrimary} 0%, #40a9ff 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent'
                            }}>
                                Kost.inn
                            </Text>
                            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: -4 }}>
                                Platform Cari Kost
                            </Text>
                        </div>
                    </div>

                    <Space size="middle">
                        <Badge count={0} size="small">
                            <Dropdown menu={{ items: notificationItems }} placement="bottomRight" arrow>
                                <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
                            </Dropdown>
                        </Badge>

                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                            <Button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    height: 40,
                                    padding: '4px 12px',
                                    borderRadius: 20,
                                    border: `1px solid ${colorBorder}`,
                                    background: '#fafafa'
                                }}
                            >
                                <Avatar
                                    size="small"
                                    src={userAvatar}
                                    icon={!userAvatar && <UserOutlined />}
                                    style={{ backgroundColor: colorPrimary }}
                                />
                                <div style={{ textAlign: 'left' }}>
                                    <Text strong style={{ fontSize: 13, display: 'block', lineHeight: 1.2 }}>
                                        {isLoggedIn ? displayName : 'Guest'}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                        {isLoggedIn ? displayRole : 'Not Logged In'}
                                    </Text>
                                </div>
                            </Button>
                        </Dropdown>
                    </Space>
                </div>

                {isKostListPage && (
                    <>
                        <Divider style={{ margin: '8px 0' }} />
                        <div style={{ padding: '8px 0 16px 0' }}>
                            <div style={{ marginBottom: 12 }}>
                                <Text strong style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <HomeOutlined style={{ color: colorPrimary }} />
                                    Eksplorasi Kost
                                </Text>
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    Temukan kost impian Anda dengan mudah dan cepat
                                </Text>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 12,
                                alignItems: 'center'
                            }}>
                                <Input
                                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Cari kost atau lokasi..."
                                    style={{ width: 260 }}
                                    allowClear
                                    size="large"
                                    value={searchText}
                                    onChange={handleSearchChange}
                                />
                                <Select
                                    placeholder="Tipe Kost"
                                    style={{ width: 140 }}
                                    allowClear
                                    size="large"
                                    value={filterTipe}
                                    onChange={handleTipeChange}
                                >
                                    <Option value="putra">
                                        <Space>
                                            <span>👨</span> Putra
                                        </Space>
                                    </Option>
                                    <Option value="putri">
                                        <Space>
                                            <span>👩</span> Putri
                                        </Space>
                                    </Option>
                                    <Option value="campur">
                                        <Space>
                                            <span>👥</span> Campur
                                        </Space>
                                    </Option>
                                </Select>
                                <Select
                                    placeholder="Rentang Harga"
                                    style={{ width: 170 }}
                                    allowClear
                                    size="large"
                                    value={filterHarga}
                                    onChange={handleHargaChange}
                                >
                                    <Option value="under500">💰 &lt; Rp 500.000</Option>
                                    <Option value="500-1m">💰 Rp 500.000 - 1.000.000</Option>
                                    <Option value="above1m">💰 &gt; Rp 1.000.000</Option>
                                </Select>
                                {isLoggedIn && isAdminOrOwner() && (
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        size="large"
                                        onClick={() => navigate('/tambah-kost')}
                                        style={{
                                            background: `linear-gradient(135deg, ${colorPrimary} 0%, #40a9ff 100%)`,
                                            border: 'none'
                                        }}
                                    >
                                        Tambah Kost Baru
                                    </Button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </Header>

            {breadcrumbItems && breadcrumbItems.length > 0 && (
                <div style={{
                    background: colorBgContainer,
                    padding: '8px 24px',
                    borderBottom: `1px solid ${colorBorder}`,
                    position: 'sticky',
                    top: isKostListPage ? 'auto' : 0,
                    zIndex: 99
                }}>
                    <Breadcrumb
                        items={breadcrumbItems}
                        style={{ fontSize: 13 }}
                    />
                </div>
            )}
        </>
    );
};

export default LayoutHeader;