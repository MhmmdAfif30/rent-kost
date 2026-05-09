import React from 'react'
import { Layout } from 'antd';
import LayoutMenu from './Menu';
import { getSessionData } from '../components/Global/Formatter'; 

const { Sider } = Layout;

const LayoutSidebar = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    
    const session = getSessionData();
    const user = session?.user;

    const isAdmin = user?.user_id === 1 && user?.role === 'admin';
    const isOwner = user?.user_id === 2 && user?.role === 'owner';

    if (!isAdmin && !isOwner) {
        return null;
    }

    return (
        <Sider 
            width={300}
            breakpoint="lg"
            collapsedWidth="0"
            collapsible 
            collapsed={collapsed} 
            onCollapse={value => setCollapsed(value)}
        >
            <LayoutMenu />
        </Sider>
    )
}

export default LayoutSidebar;