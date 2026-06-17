import React from 'react';
import { Card, Button, Row, Col, Typography, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CardList = ({
    data,
    column,
    header,
    showPreviewModal,
    showEditModal,
    showDeleteDialog,
    cardColor,
    fieldColor,
}) => {
    // PASTIKAN data adalah array
    const dataArray = Array.isArray(data) ? data : [];

    const getCardStyle = (color) => {
        const colorStyle = color ?? '#F3EDEA';
        return {
            border: `2px solid ${colorStyle}`,
            borderRadius: '8px',
            textAlign: 'center',
        };
    };

    const getTitleStyle = (color) => {
        const backgroundColor = color ?? '#FCF2ED';
        return {
            backgroundColor,
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            width: 'fit-content',
        };
    };

    // Jika tidak ada data, tampilkan pesan
    if (dataArray.length === 0) {
        return (
            <Row gutter={[16, 16]} style={{ marginTop: '16px', justifyContent: 'left' }}>
                <Col span={24}>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Text type="secondary">Tidak ada data</Text>
                    </div>
                </Col>
            </Row>
        );
    }

    return (
        <Row gutter={[16, 16]} style={{ marginTop: '16px', justifyContent: 'left' }}>
            {dataArray.map((item) => (
                <Col xs={24} sm={24} md={12} lg={6} key={item.payments_id || item.id || Math.random()}>
                    <Card
                        title={
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <span
                                    style={getTitleStyle(fieldColor ? item[fieldColor] : cardColor)}
                                >
                                    {item[header] || 'No Title'}
                                </span>
                            </div>
                        }
                        style={getCardStyle(fieldColor ? item[fieldColor] : cardColor)}
                        actions={[
                            showPreviewModal && (
                                <EyeOutlined
                                    style={{ color: '#1890ff' }}
                                    key="preview"
                                    onClick={() => showPreviewModal(item)}
                                />
                            ),
                            showEditModal && (
                                <EditOutlined
                                    style={{ color: '#faad14' }}
                                    key="edit"
                                    onClick={() => showEditModal(item)}
                                />
                            ),
                            showDeleteDialog && (
                                <DeleteOutlined
                                    style={{ color: '#ff1818' }}
                                    key="delete"
                                    onClick={() => showDeleteDialog(item)}
                                />
                            ),
                        ].filter(Boolean)}
                    >
                        <div style={{ textAlign: 'left' }}>
                            {column.map((itemCard, index) => (
                                <React.Fragment key={index}>
                                    {!itemCard.hidden &&
                                        itemCard.title !== 'No' &&
                                        itemCard.title !== 'Action' && (
                                            <p style={{ margin: '8px 0' }}>
                                                <Text strong>{itemCard.title}:</Text>{' '}
                                                {itemCard.render
                                                    ? itemCard.render(
                                                          item[itemCard.dataIndex],
                                                          item,
                                                          index
                                                      )
                                                    : item[itemCard.dataIndex] ||
                                                      item[itemCard.key] ||
                                                      '-'}
                                            </p>
                                        )}
                                </React.Fragment>
                            ))}
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default CardList;