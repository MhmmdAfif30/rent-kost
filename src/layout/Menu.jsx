import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Typography, Image } from 'antd';
import { getSessionData } from '../components/Global/Formatter';
import { HomeOutlined,
    DatabaseOutlined,
    SettingOutlined,
    UserOutlined,
    AntDesignOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    HistoryOutlined,
    DollarOutlined,
    RollbackOutlined,
    ProductOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const allItems = [
    {
        key: 'home',
        icon: <HomeOutlined style={{fontSize:'19px'}} />,
        label: <Link to="/dashboard/home" className='fontMenus'>Home</Link>,
    },
    {
        key: 'master',
        icon: <DatabaseOutlined style={{fontSize:'19px'}} />,
        label: 'Master',
        children: [
             {
                key: 'master-product',
                icon: <DatabaseOutlined style={{fontSize:'19px'}} />,
                label: <Link to="/master/product">Product</Link>,
            },
        ],
    },
];

const LayoutMenu = () => {
    const [stateOpenKeys, setStateOpenKeys] = useState(['home']);

    const getLevelKeys = items1 => {
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

    const levelKeys = getLevelKeys(allItems);

    const onOpenChange = openKeys => {
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

    const session = getSessionData();
    const isAdmin = session?.user?.user_id;

    const karyawan = ()=>{
        return allItems.filter(
            item => item.key !== 'setting'
            // tambahkan menu jika terdapat menu yang di sembunyikan dari user karyawan
            // && item.key !== 'master'
            // && item.key !== 'master'
        ).map(item=>{
            if(item.key === 'master'){
                return{
                    ...item,
                    // buka command dibawah jika terdapat sub menu yang di sembunyikan
                    // children: item.children.filter(
                    //     child => child.key !== 'master-product'
                    // tambahkan menu jika terdapat menu yang di sembunyikan dari user karyawan
                    //     && child.key !== 'master-service'
                    // )
                }
            }
            return item;
        });
    };
    const items = isAdmin === 1 ? allItems : karyawan();

    return (
        <Menu
            theme="dark"
            mode="inline"
            items={items}
            defaultSelectedKeys={['home']}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
        />
    );
};
export default LayoutMenu;