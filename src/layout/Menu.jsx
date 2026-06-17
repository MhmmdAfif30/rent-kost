import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Typography, Alert, Space } from 'antd';
import { getUserData, isAdminOrOwner, isSuperAdmin } from '../components/Global/Formatter';
import { 
    HomeOutlined,
    DatabaseOutlined,
    SettingOutlined,
    UserOutlined,
    DollarOutlined,
    ProductOutlined,
    TeamOutlined,
    BankOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// Definisi semua menu
const allItems = [
    {
        key: 'home',
        icon: <HomeOutlined style={{ fontSize: '19px' }} />,
        label: <Link to="/dashboard/home">Home</Link>,
    },
    {
        key: 'kost',
        icon: <DatabaseOutlined style={{ fontSize: '19px' }} />,
        label: 'Kost Management',
        children: [
            {
                key: 'kost-list',
                icon: <DatabaseOutlined style={{ fontSize: '19px' }} />,
                label: <Link to="/kost">Daftar Kost</Link>,
            },
            {
                key: 'kost-management',
                icon: <SettingOutlined style={{ fontSize: '19px' }} />,
                label: <Link to="/kost/management-kost">Management Kost</Link>,
            },
            {
                key: 'kost-add',
                icon: <ProductOutlined style={{ fontSize: '19px' }} />,
                label: <Link to="/kost/tambah">Tambah Kost</Link>,
            },
        ],
    },
    {
        key: 'finance',
        icon: <DollarOutlined style={{ fontSize: '19px' }} />,
        label: 'Finance',
        children: [
            {
                key: 'pembayaran',
                icon: <BankOutlined style={{ fontSize: '19px' }} />,
                label: <Link to="/finance/pembayaran">Pembayaran</Link>,
            },
            {
                key: 'laporan',
                icon: <FileTextOutlined style={{ fontSize: '19px' }} />,
                label: <Link to="/finance/laporan">Laporan Keuangan</Link>,
            },
        ],
    },
    {
        key: 'user-management',
        icon: <UserOutlined style={{ fontSize: '19px' }} />,
        label: 'User Management',
        children: [
            {
                key: 'users',
                icon: <TeamOutlined style={{ fontSize: '19px' }} />,
                label: <Link to="/users">Daftar User</Link>,
            },
        ],
    },
    {
        key: 'settings',
        icon: <SettingOutlined style={{ fontSize: '19px' }} />,
        label: 'Settings',
        children: [
            {
                key: 'profile',
                icon: <UserOutlined style={{ fontSize: '19px' }} />,
                label: <Link to="/settings/profile">Profile</Link>,
            },
        ],
    },
];

const LayoutMenu = () => {
    const [stateOpenKeys, setStateOpenKeys] = useState(['home']);
    const [userRole, setUserRole] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMenu = () => {
            // Debug: Cek semua yang ada di localStorage
            console.log('=== LOCALSTORAGE CONTENTS ===');
            console.log('user:', localStorage.getItem('user'));
            console.log('session:', localStorage.getItem('session'));
            console.log('token:', localStorage.getItem('token'));
            console.log('===============================');
            
            // Ambil role user
            const role = getUserData();
            const userData = getUserData();
            const isAdminOwner = isAdminOrOwner();
            const superAdmin = isSuperAdmin();
            
            console.log('=== USER INFO ===');
            console.log('User Role:', role);
            console.log('User Data:', userData);
            console.log('Is Admin/Owner:', isAdminOwner);
            console.log('Is Super Admin:', superAdmin);
            console.log('=================');
            
            setUserRole(role);
            
            // Filter menu berdasarkan role
            let filtered = [];
            
            if (role === 'Super Admin') {
                console.log('Showing all menus for Super Admin');
                filtered = allItems;
            } 
            else if (isAdminOwner) {
                console.log('Showing menus for Admin/Owner');
                filtered = allItems.filter(item => 
                    item.key !== 'user-management'
                );
            } 
            else if (role) {
                console.log('Showing basic menus for regular user');
                filtered = [
                    {
                        key: 'home',
                        icon: <HomeOutlined style={{ fontSize: '19px' }} />,
                        label: <Link to="/dashboard/home">Home</Link>,
                    },
                    {
                        key: 'kost',
                        icon: <DatabaseOutlined style={{ fontSize: '19px' }} />,
                        label: 'Kost',
                        children: [
                            {
                                key: 'kost-list',
                                icon: <DatabaseOutlined style={{ fontSize: '19px' }} />,
                                label: <Link to="/kost">Daftar Kost</Link>,
                            },
                        ],
                    },
                    {
                        key: 'settings',
                        icon: <SettingOutlined style={{ fontSize: '19px' }} />,
                        label: 'Settings',
                        children: [
                            {
                                key: 'profile',
                                icon: <UserOutlined style={{ fontSize: '19px' }} />,
                                label: <Link to="/settings/profile">Profile</Link>,
                            },
                        ],
                    },
                ];
            } else {
                console.log('No role found, showing login prompt');
                filtered = [
                    {
                        key: 'home',
                        icon: <HomeOutlined style={{ fontSize: '19px' }} />,
                        label: <Link to="/dashboard/home">Home</Link>,
                    },
                ];
            }
            
            console.log('Filtered Menu Items:', filtered);
            setMenuItems(filtered);
            setLoading(false);
        };

        loadMenu();
    }, []);

    const getLevelKeys = (items1) => {
        const key = {};
        const func = (items2, level = 1) => {
            items2.forEach(item => {
                if (item.key) {
                    key[item.key] = level;
                }
                if (item.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    };

    const levelKeys = getLevelKeys(menuItems);

    const onOpenChange = (openKeys) => {
        const currentOpenKey = openKeys.find(key => stateOpenKeys.indexOf(key) === -1);
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys.filter(key => key !== currentOpenKey).findIndex(key => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys.filter((_, index) => index !== repeatIndex).filter(key => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            setStateOpenKeys(openKeys);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Text>Loading menu...</Text>
            </div>
        );
    }

    // Jika tidak ada menu yang ditampilkan
    if (menuItems.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Alert 
                    message="No Menu Available" 
                    description={`Your role: ${userRole || 'Not logged in'}`} 
                    type="warning" 
                    showIcon 
                />
            </div>
        );
    }

    return (
        <Menu
            theme="dark"
            mode="inline"
            items={menuItems}
            defaultSelectedKeys={['home']}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
        />
    );
};

export default LayoutMenu;