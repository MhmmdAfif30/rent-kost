import React, { memo, useState, useEffect } from 'react';
import { Space, Tag, ConfigProvider, Button, Row, Col, Card, Input } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { NotifAlert, NotifOk, NotifConfirmDialog } from '../../components/Global/ToastNotif';
import { useNavigate } from 'react-router-dom';
import { listInvoices, detailInvoices, deleteInvoices } from '../../api/invoice';
import TableList from '../../components/Global/TableList';

const columns = (showPreviewModal, showEditModal, showDeleteDialog) => [
    {
        title: 'No',
        key: 'no',
        width: '5%',
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Due Date Status',
        dataIndex: 'is_due_date',
        key: 'is_due_date',
        width: '12%',
        align: 'center',
        render: (value) => (
            <Tag color={value === 1 ? 'red' : 'green'}>
                {value === 1 ? 'Due' : 'Not Due'}
            </Tag>
        ),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: '12%',
        align: 'right',
        render: (value) => {
            if (value) {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                }).format(parseFloat(value));
            }
            return '-';
        },
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '8%',
        align: 'center',
    },
    {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
        width: '10%',
        align: 'right',
        render: (value) => {
            if (value) {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                }).format(parseFloat(value));
            }
            return '-';
        },
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: '12%',
        align: 'right',
        render: (value) => {
            if (value) {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                }).format(parseFloat(value));
            }
            return '-';
        },
    },
    {
        title: 'Status',
        dataIndex: 'is_active',
        key: 'is_active',
        width: '8%',
        align: 'center',
        render: (value) => (
            <Tag color={value === 1 ? 'green' : 'default'}>
                {value === 1 ? 'Active' : 'Inactive'}
            </Tag>
        ),
    },
    {
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
        width: '12%',
        render: (value) => {
            if (value) {
                return new Date(value).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            }
            return '-';
        },
    },
    {
        title: 'End Date',
        dataIndex: 'end_date',
        key: 'end_date',
        width: '12%',
        render: (value) => {
            if (value) {
                return new Date(value).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            }
            return '-';
        },
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

const ListInvoices = memo(function ListInvoices(props) {
    const [trigerFilter, setTrigerFilter] = useState(false);
    const defaultFilter = { criteria: '' };
    const [formDataFilter, setFormDataFilter] = useState(defaultFilter);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

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
        props.setSelectedData(param);
        props.setActionMode('preview');
    };

    const showEditModal = (param = null) => {
        props.setSelectedData(param);
        props.setActionMode('edit');
    };

    const showAddModal = (param = null) => {
        props.setSelectedData(param);
        props.setActionMode('add');
    };

    const showDeleteDialog = (param) => {
        NotifConfirmDialog({
            icon: 'question',
            title: 'Konfirmasi Hapus',
            message: `Invoice dengan ID "${param.invoices_id}" akan dihapus?`,
            onConfirm: () => handleDelete(param.invoices_id, param.invoices_id),
            onCancel: () => props.setSelectedData(null),
        });
    };

    const handleDelete = async (invoices_id, invoiceId) => {
        try {
            const response = await deleteInvoices(invoices_id);
            if (response.statusCode === 200) {
                NotifAlert({
                    icon: 'success',
                    title: 'Berhasil',
                    message: `Data Invoice "${invoiceId}" berhasil dihapus.`,
                });
                doFilter();
            } else {
                NotifOk({
                    icon: 'error',
                    title: 'Gagal',
                    message: response.message || 'Gagal Menghapus Data Invoice',
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

    return (
        <React.Fragment>
            <Card>
                <Row>
                    <Col xs={24}>
                        <Row justify="space-between" align="middle" gutter={[8, 8]}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Input.Search
                                    placeholder="Search invoice by ID, User ID, or Room Kost ID..."
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
                                            Add Invoice
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
                            getData={listInvoices}
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
        </React.Fragment>
    );
});

export default ListInvoices;