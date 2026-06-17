import React, { memo, useState, useEffect } from 'react';
import { Space, Tag, ConfigProvider, Button, Row, Col, Card, Input } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { NotifAlert, NotifOk, NotifConfirmDialog } from '../../components/Global/ToastNotif';
import { useNavigate } from 'react-router-dom';
import { listPembayaran, detailPembayaran, deletePembayaran } from '../../api/pembayaran';
import TableList from '../../components/Global/TableList';
import DetailPembayaran from './detailPembayaran';

const columns = (showPreviewModal, showEditModal, showDeleteDialog) => [
    {
        title: 'No',
        key: 'no',
        width: '5%',
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Invoice ID',
        dataIndex: 'invoices_id',
        key: 'invoices_id',
        width: '15%',
        ellipsis: true,
        render: (value) => (
            <Tag color="blue">
                INV-{String(value).padStart(3, '0')}
            </Tag>
        ),
    },
    {
        title: 'Type Payment',
        dataIndex: 'type_payment',
        key: 'type_payment',
        width: '15%',
        render: (value) => {
            const colors = {
                transfer: 'blue',
                cash: 'green',
                credit_card: 'purple',
                e_wallet: 'orange',
                virtual_account: 'cyan',
                retail: 'magenta',
            };
            return (
                <Tag color={colors[value?.toLowerCase()] || 'default'}>
                    {value?.toUpperCase() || '-'}
                </Tag>
            );
        },
    },
    {
        title: 'Status',
        dataIndex: 'is_active',
        key: 'is_active',
        width: '10%',
        align: 'center',
        render: (value) => (
            <Tag color={value === true || value === 1 ? 'green' : 'default'}>
                {value === true || value === 1 ? 'Active' : 'Inactive'}
            </Tag>
        ),
    },
    {
        title: 'Action',
        key: 'aksi',
        align: 'center',
        width: '15%',
        render: (_, record) => (
            <Space>
                <Button
                    type="text"
                    style={{ borderColor: '#1890ff' }}
                    icon={<EyeOutlined style={{ color: '#1890ff' }} />}
                    onClick={() => showPreviewModal(record)}
                />
                <Button
                    type="text"
                    style={{ borderColor: '#faad14' }}
                    icon={<EditOutlined style={{ color: '#faad14' }} />}
                    onClick={() => showEditModal(record)}
                />
                <Button
                    type="text"
                    danger
                    style={{ borderColor: 'red' }}
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteDialog(record)}
                />
            </Space>
        ),
    },
];

const ListPembayaran = memo(function ListPembayaran(props) {
    const [trigerFilter, setTrigerFilter] = useState(false);
    const defaultFilter = { criteria: '' };
    const [formDataFilter, setFormDataFilter] = useState(defaultFilter);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    // State untuk DetailPembayaran
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [actionMode, setActionMode] = useState('list'); // 'list', 'add', 'edit', 'detail'

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (props.actionMode === 'list') {
                setFormDataFilter(defaultFilter);
                doFilter();
            }
        } else {
            navigate('/signin');
        }
    }, [props.actionMode]);

    const doFilter = () => {
        setTrigerFilter((prev) => !prev);
    };

    const handleSearch = () => {
        setFormDataFilter({ criteria: searchValue });
        setTrigerFilter((prev) => !prev);
    };

    const handleSearchClear = () => {
        setSearchValue('');
        setFormDataFilter({ criteria: '' });
        setTrigerFilter((prev) => !prev);
    };

    const showPreviewModal = (param) => {
        setSelectedData(param);
        setActionMode('detail');
        setShowDetailModal(true);
    };

    const showEditModal = (param) => {
        setSelectedData(param);
        setActionMode('edit');
        setShowDetailModal(true);
    };

    const showAddModal = () => {
        setSelectedData(null);
        setActionMode('add');
        setShowDetailModal(true);
    };

    const showDeleteDialog = (param) => {
        NotifConfirmDialog({
            icon: 'question',
            title: 'Konfirmasi Hapus',
            message: `Payment dengan Invoice ID "${param.invoices_id}" akan dihapus?`,
            onConfirm: () => handleDelete(param.payments_id, param.invoices_id),
            onCancel: () => setSelectedData(null),
        });
    };

    const handleDelete = async (payments_id, invoices_id) => {
        try {
            const response = await deletePembayaran(payments_id);
            if (response.statusCode === 200) {
                NotifAlert({
                    icon: 'success',
                    title: 'Berhasil',
                    message: `Data Payment untuk Invoice "${invoices_id}" berhasil dihapus.`,
                });
                doFilter();
            } else {
                NotifOk({
                    icon: 'error',
                    title: 'Gagal',
                    message: response.message || 'Gagal Menghapus Data Payment',
                });
            }
        } catch (error) {
            NotifOk({
                icon: 'error',
                title: 'Error',
                message: 'Terjadi kesalahan saat menghapus data',
            });
        }
    };

    // Handler untuk menutup modal DetailPembayaran
    const handleDetailModalClose = () => {
        setShowDetailModal(false);
        setSelectedData(null);
        setActionMode('list');
        doFilter(); // Refresh data setelah modal ditutup
    };

    return (
        <React.Fragment>
            <Card>
                <Row>
                    <Col xs={24}>
                        <Row justify="space-between" align="middle" gutter={[8, 8]}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Input.Search
                                    placeholder="Search payment by Invoice ID or Type Payment..."
                                    value={searchValue}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchValue(value);
                                        if (value === '') {
                                            setFormDataFilter({ criteria: '' });
                                            setTrigerFilter((prev) => !prev);
                                        }
                                    }}
                                    onSearch={handleSearch}
                                    allowClear={{
                                        clearIcon: <span onClick={handleSearchClear}>✕</span>,
                                    }}
                                    enterButton={
                                        <Button
                                            type="primary"
                                            icon={<SearchOutlined />}
                                            style={{
                                                backgroundColor: ' #40a9ff',
                                                borderColor: ' #40a9ff',
                                            }}
                                        >
                                            Search
                                        </Button>
                                    }
                                    size="large"
                                />
                            </Col>
                            <Col>
                                <Space wrap size="small">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Button: {
                                                    defaultBg: 'white',
                                                    defaultColor: ' #40a9ff',
                                                    defaultBorderColor: ' #40a9ff',
                                                },
                                            },
                                        }}
                                    >
                                        <Button
                                            icon={<PlusOutlined />}
                                            onClick={() => showAddModal()}
                                            size="large"
                                        >
                                            Add Payment
                                        </Button>
                                    </ConfigProvider>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginTop: '16px' }}>
                        <TableList
                            mobile
                            cardColor={'#42AAFF'}
                            header={'invoices_id'}
                            showPreviewModal={showPreviewModal}
                            showEditModal={showEditModal}
                            showDeleteDialog={showDeleteDialog}
                            getData={listPembayaran}
                            queryParams={formDataFilter}
                            columns={columns(showPreviewModal, showEditModal, showDeleteDialog)}
                            triger={trigerFilter}
                            onGetData={(fetchedData) => {
                                console.log('Data fetched:', fetchedData);
                            }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* DetailPembayaran Modal */}
            <DetailPembayaran
                showModal={showDetailModal}
                setShowModal={setShowDetailModal}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                actionMode={actionMode}
                setActionMode={setActionMode}
                readOnly={actionMode === 'detail'}
                onClose={handleDetailModalClose}
            />
        </React.Fragment>
    );
});

export default ListPembayaran;