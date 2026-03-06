import { useEffect, useState } from 'react';
import { Card, Typography, Flex } from 'antd';
import { useBreadcrumb } from '../../layout/Breadcrumb';

const { Text } = Typography;

const Home = () => {
    const { setBreadcrumbItems } = useBreadcrumb();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setBreadcrumbItems([
                {
                    title: (
                        <Text strong style={{ fontSize: '14px' }}>
                            • Dashboard
                        </Text>
                    ),
                },
                {
                    title: (
                        <Text strong style={{ fontSize: '14px' }}>
                            Home
                        </Text>
                    ),
                },
            ]);
        } 
    }, []);
};

export default Home;
