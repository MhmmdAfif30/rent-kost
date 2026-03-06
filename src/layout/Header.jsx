import React from 'react';
import { Layout, theme, Space, Typography, Breadcrumb, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useBreadcrumb } from './Breadcrumb';
// import { decryptData } from '../components/Global/Formatter';
import { useNavigate } from 'react-router-dom';

const { Link, Text } = Typography;
const { Header } = Layout;

const LayoutHeader = () => {
    const { breadcrumbItems } = useBreadcrumb();
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, colorBorder, colorText },
    } = theme.useToken();

    // // Ambil data user dari localStorage dan dekripsi
    const sessionData = localStorage.getItem('session');
     if (!sessionData) {
        return null; 
    }
    // const userData = sessionData ? decryptData(sessionData) : null;
    // // console.log(userData);

    const roleName =  'Guest';

    const userName = 'User';

    return (
        <>
            <Header
                style={{
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    rowGap: 10,
                    paddingTop:15,
                    paddingBottom: 20,
                    paddingLeft: 24,
                    paddingRight: 24,
                    minHeight: 100, 
                    boxSizing: 'border-box',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12,
                    }}
                >
                    <Text
                        style={{
                            color: colorText,
                            fontSize: 16,
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Login AS {roleName}
                    </Text>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 10,
                    }}
                >
                    <Button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#f5f5f5',
                            border: `1px solid ${colorBorder}`,
                            borderRadius: 6,
                            padding: '4px 12px',
                        }}
                    >
                        <UserOutlined style={{ fontSize: 16, color: colorText }} />
                        <Text style={{ marginLeft: 8, color: colorText }} strong>
                            {userName}
                        </Text>
                    </Button>
                </div>
            </Header>

            <div style={{ width: '100%', maxWidth: '50%', textAlign: 'left' }}>
                <Breadcrumb
                    style={{
                        marginLeft: '20px',
                        marginTop: '20px',
                        marginBottom: '10px',
                    }}
                    items={breadcrumbItems || []}
                />
            </div>
        </>
    );
};

export default LayoutHeader;
