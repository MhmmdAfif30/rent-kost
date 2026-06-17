import React, { useEffect, useState, useCallback } from 'react'; // Tambahkan useCallback
import {
    Modal,
    Input,
    Divider,
    Typography,
    Switch,
    Button,
    ConfigProvider,
    Select,
    Tag,
    Space,
    Alert,
} from 'antd';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { NotifAlert, NotifOk } from '../../components/Global/ToastNotif';
import {
    createPembayaran,
    updatePembayaran,
    syncPaymentStatus,
} from '../../api/pembayaran';
import {
    listInvoices
} from "../../api/invoice"
import dayjs from 'dayjs';

const { Text } = Typography;
const { TextArea } = Input;

const DetailPembayaran = (props) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    const [syncResult, setSyncResult] = useState(null);

    const defaultData = {
        payments_id: '',
        invoices_id: '',
        type_payment: '',
        is_approve: false,
        is_active: true,
        order_id: '',
        previous_status: '',
        current_status: '',
        midtrans_status: '',
        fraud_status: '',
    };

    const [formData, setFormData] = useState(defaultData);

    const {
        showModal,
        setShowModal,
        selectedData,
        setSelectedData,
        actionMode,
        setActionMode,
        readOnly,
        onClose,
        onRefresh,
        getData = listInvoices,
        refreshTrigger = 0,
    } = props;

    const handleCancel = () => {
        setSelectedData(null);
        setActionMode('list');
        setShowModal(false);
        setSyncResult(null);
        if (onClose) onClose();
    };

    const handleSyncStatus = async () => {
        if (!formData.order_id) {
            NotifAlert({
                icon: 'warning',
                title: 'Sync Gagal',
                message: 'Order ID tidak ditemukan untuk sinkronisasi.',
            });
            return;
        }

        setSyncLoading(true);
        setSyncResult(null);

        try {
            const response = await syncPaymentStatus(formData.order_id);

            if (response && response.statusCode === 200) {
                const data = response.data || {};

                setSyncResult({
                    success: true,
                    message: 'Status payment berhasil disinkronkan',
                    data: data,
                });

                NotifOk({
                    icon: 'success',
                    title: 'Sync Berhasil',
                    message: `Status payment: ${data.current_status?.toUpperCase() || 'Success'}`,
                });

                setFormData(prev => ({
                    ...prev,
                    previous_status: data.previous_status || prev.previous_status,
                    current_status: data.current_status || prev.current_status,
                    midtrans_status: data.midtrans_status || prev.midtrans_status,
                    fraud_status: data.fraud_status || prev.fraud_status,
                }));

                if (onRefresh) onRefresh();
            } else {
                setSyncResult({
                    success: false,
                    message: response?.message || 'Gagal sinkronisasi status payment',
                });

                NotifAlert({
                    icon: 'error',
                    title: 'Sync Gagal',
                    message: response?.message || 'Gagal sinkronisasi status payment',
                });
            }
        } catch (error) {
            console.error('Sync Status Error:', error);

            setSyncResult({
                success: false,
                message: error.message || 'Terjadi kesalahan saat sinkronisasi',
            });

            NotifAlert({
                icon: 'error',
                title: 'Sync Error',
                message: error.message || 'Terjadi kesalahan saat sinkronisasi',
            });
        }
        setSyncLoading(false);
    };

    const handleSave = async () => {
        if (!formData.invoices_id) {
            NotifAlert({
                icon: 'warning',
                title: 'Validasi Gagal',
                message: 'Silakan pilih Invoice terlebih dahulu.',
            });
            return;
        }

        if (!formData.type_payment) {
            NotifAlert({
                icon: 'warning',
                title: 'Validasi Gagal',
                message: 'Silakan pilih Type Payment.',
            });
            return;
        }

        setConfirmLoading(true);
        setSyncResult(null);

        try {
            const payload = {
                invoices_id: parseInt(formData.invoices_id),
                type_payment: formData.type_payment,
                is_approve: formData.is_approve || false,
                is_active: formData.is_active || true,
                order_id: formData.order_id || undefined,
                orderId: formData.order_id || undefined,
            };

            console.log('Payload yang dikirim:', payload);

            let response;
            if (formData.payments_id) {
                response = await updatePembayaran(formData.payments_id, payload);
            } else {
                response = await createPembayaran(payload);
            }

            console.log('Response dari server:', response);

            if (response && (response.statusCode === 200 || response.statusCode === 201)) {
                if (response.data) {
                    setFormData(prev => ({
                        ...prev,
                        previous_status: response.data.previous_status || prev.previous_status,
                        current_status: response.data.current_status || prev.current_status,
                        midtrans_status: response.data.midtrans_status || prev.midtrans_status,
                        fraud_status: response.data.fraud_status || prev.fraud_status,
                    }));

                    setSyncResult({
                        success: true,
                        message: 'Payment berhasil disinkronkan',
                        data: response.data,
                    });
                }

                NotifOk({
                    icon: 'success',
                    title: 'Berhasil',
                    message: `Data Payment berhasil ${formData.payments_id ? 'disinkronkan' : 'ditambahkan'}.`,
                });

                await fetchInvoices();

                if (onRefresh) onRefresh();

                if (actionMode === 'add') {
                    setActionMode('list');
                    setShowModal(false);
                    if (onClose) onClose();
                } else {
                    setActionMode('detail');
                }
            } else {
                NotifAlert({
                    icon: 'error',
                    title: 'Gagal',
                    message: response?.message || 'Terjadi kesalahan saat menyimpan data.',
                });
            }
        } catch (error) {
            console.error('Save Payment Error:', error);

            setSyncResult({
                success: false,
                message: error.message || 'Terjadi kesalahan pada server.',
            });

            NotifAlert({
                icon: 'error',
                title: 'Error',
                message: error.message || 'Terjadi kesalahan pada server. Coba lagi nanti.',
            });
        }

        setConfirmLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleStatusToggle = (checked, field) => {
        setFormData({
            ...formData,
            [field]: checked,
        });
    };

    const fetchInvoices = useCallback(async () => {
        setLoadingInvoices(true);
        try {
            const queryParams = new URLSearchParams();
            const response = await getData(queryParams);

            if (response && response.data) {
                const mappedInvoices = response.data.map(invoice => ({
                    invoices_id: invoice.id || invoice.invoices_id,
                    label: invoice.label ||
                        `${invoice.invoice_number || 'INV-' + (invoice.id || invoice.invoices_id)} - ${invoice.customer_name || 'Customer'}`
                }));
                setInvoices(mappedInvoices);
            } else {
                setInvoices([]);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
            NotifAlert({
                icon: 'error',
                title: 'Error',
                message: error.message || 'Gagal mengambil data invoice',
            });
            setInvoices([]);
        } finally {
            setLoadingInvoices(false);
        }
    }, [getData]);


    useEffect(() => {
        if (showModal && (actionMode === 'add' || actionMode === 'edit')) {
            fetchInvoices();
        }
    }, [showModal, actionMode, fetchInvoices, refreshTrigger]); // Tambahkan refreshTrigger

    useEffect(() => {
        if (showModal && selectedData) {
            setFormData({
                ...selectedData,
                is_approve: selectedData.is_approve === true || selectedData.is_approve === 1,
                is_active: selectedData.is_active === true || selectedData.is_active === 1,
                order_id: selectedData.order_id || selectedData.orderId || '',
                previous_status: selectedData.previous_status || '',
                current_status: selectedData.current_status || '',
                midtrans_status: selectedData.midtrans_status || '',
                fraud_status: selectedData.fraud_status || '',
            });
            setSyncResult(null);
        } else if (showModal && actionMode === 'add') {
            setFormData(defaultData);
            setSyncResult(null);
        }
    }, [showModal, selectedData, actionMode]);

    const paymentTypeOptions = [
        { value: 'virtual_account', label: 'Virtual Account' },
    ];

    const isReadOnly = readOnly || actionMode === 'detail';
    const showSyncButton = (actionMode === 'edit' || actionMode === 'detail') && formData.order_id;

    const renderStatusTag = (status) => {
        const statusMap = {
            'success': { color: 'green', label: 'Success' },
            'pending': { color: 'orange', label: 'Pending' },
            'failed': { color: 'red', label: 'Failed' },
            'settlement': { color: 'green', label: 'Settlement' },
            'capture': { color: 'blue', label: 'Capture' },
            'authorize': { color: 'purple', label: 'Authorize' },
            'deny': { color: 'red', label: 'Deny' },
            'cancel': { color: 'red', label: 'Cancel' },
            'expire': { color: 'red', label: 'Expire' },
            'refund': { color: 'orange', label: 'Refund' },
            'partial_refund': { color: 'orange', label: 'Partial Refund' },
        };

        const statusInfo = statusMap[status?.toLowerCase()] || { color: 'default', label: status?.toUpperCase() || 'Unknown' };
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
    };

    return (
        <Modal
            title={`${actionMode === 'add'
                    ? 'Tambah'
                    : actionMode === 'detail'
                        ? 'Detail'
                        : 'Edit'
                } Payment`}
            open={showModal}
            onCancel={handleCancel}
            width={750}
            footer={[
                <React.Fragment key="modal-footer">
                    {showSyncButton && (
                        <ConfigProvider
                            theme={{
                                token: { colorBgContainer: '#FAAD14' },
                                components: {
                                    Button: {
                                        defaultBg: '#FAAD14',
                                        defaultColor: '#FFFFFF',
                                        defaultBorderColor: '#FAAD14',
                                        defaultHoverColor: '#FFFFFF',
                                        defaultHoverBorderColor: '#FAAD14',
                                    },
                                },
                            }}
                        >
                            <Button
                                icon={<SyncOutlined spin={syncLoading} />}
                                loading={syncLoading}
                                onClick={handleSyncStatus}
                                style={{ marginRight: 8 }}
                            >
                                Sync Status
                            </Button>
                        </ConfigProvider>
                    )}

                    <ConfigProvider
                        theme={{
                            token: { colorBgContainer: '#E9F6EF' },
                            components: {
                                Button: {
                                    defaultBg: 'white',
                                    defaultColor: '#23A55A',
                                    defaultBorderColor: '#23A55A',
                                    defaultHoverColor: '#23A55A',
                                    defaultHoverBorderColor: '#23A55A',
                                },
                            },
                        }}
                    >
                        <Button onClick={handleCancel}>
                            {isReadOnly ? 'Tutup' : 'Batal'}
                        </Button>
                    </ConfigProvider>
                    {!isReadOnly && (
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorBgContainer: '#209652',
                                },
                                components: {
                                    Button: {
                                        defaultBg: '#23a55a',
                                        defaultColor: '#FFFFFF',
                                        defaultBorderColor: '#23a55a',
                                        defaultHoverColor: '#FFFFFF',
                                        defaultHoverBorderColor: '#23a55a',
                                    },
                                },
                            }}
                        >
                            <Button
                                loading={confirmLoading}
                                onClick={handleSave}
                                icon={formData.payments_id ? <SyncOutlined /> : null}
                            >
                                {formData.payments_id ? 'Sync & Update' : 'Simpan'}
                            </Button>
                        </ConfigProvider>
                    )}
                </React.Fragment>,
            ]}
        >
            <Divider />

            {syncResult && (
                <Alert
                    message={syncResult.success ? 'Sync Berhasil' : 'Sync Gagal'}
                    description={syncResult.message}
                    type={syncResult.success ? 'success' : 'error'}
                    showIcon
                    icon={syncResult.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    style={{ marginBottom: 16 }}
                    closable
                    onClose={() => setSyncResult(null)}
                />
            )}

            {formData && (
                <div>
                    <div style={{ marginBottom: 16 }}>
                        <div>
                            <Text strong>Payment Status</Text>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '8px',
                                gap: '16px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Switch
                                    disabled={isReadOnly}
                                    style={{
                                        backgroundColor:
                                            formData.is_active === true ? '#23A55A' : '#bfbfbf',
                                    }}
                                    checked={formData.is_active === true}
                                    onChange={(checked) => handleStatusToggle(checked, 'is_active')}
                                />
                                <Text>{formData.is_active === true ? 'Active' : 'Inactive'}</Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Switch
                                    disabled={isReadOnly}
                                    style={{
                                        backgroundColor:
                                            formData.is_approve === true ? '#1890FF' : '#bfbfbf',
                                    }}
                                    checked={formData.is_approve === true}
                                    onChange={(checked) => handleStatusToggle(checked, 'is_approve')}
                                />
                                <Text>{formData.is_approve === true ? 'Approved' : 'Not Approved'}</Text>
                            </div>
                        </div>
                    </div>

                    {(formData.current_status || formData.midtrans_status) && (
                        <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f6f6f6', borderRadius: 4 }}>
                            <Text strong style={{ display: 'block', marginBottom: 8 }}>Midtrans Status:</Text>
                            <Space size="middle" wrap>
                                {formData.previous_status && (
                                    <span>
                                        <Text type="secondary">Previous: </Text>
                                        {renderStatusTag(formData.previous_status)}
                                    </span>
                                )}
                                {formData.current_status && (
                                    <span>
                                        <Text type="secondary">Current: </Text>
                                        {renderStatusTag(formData.current_status)}
                                    </span>
                                )}
                                {formData.midtrans_status && (
                                    <span>
                                        <Text type="secondary">Midtrans: </Text>
                                        {renderStatusTag(formData.midtrans_status)}
                                    </span>
                                )}
                                {formData.fraud_status && (
                                    <span>
                                        <Text type="secondary">Fraud: </Text>
                                        <Tag color={formData.fraud_status === 'accept' ? 'green' : 'red'}>
                                            {formData.fraud_status.toUpperCase()}
                                        </Tag>
                                    </span>
                                )}
                            </Space>
                        </div>
                    )}

                    <div hidden>
                        <Text strong>Payment ID</Text>
                        <Input
                            name="payments_id"
                            value={formData.payments_id}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <Text strong>Invoice ID</Text>
                        <Text style={{ color: 'red' }}> *</Text>
                        {isReadOnly ? (
                            <Input
                                name="invoices_id"
                                value={formData.invoices_id}
                                disabled
                                style={{ backgroundColor: '#f5f5f5' }}
                            />
                        ) : (
                            <Select
                                name="invoices_id"
                                value={formData.invoices_id}
                                onChange={(value) => handleSelectChange('invoices_id', value)}
                                placeholder="Select Invoice"
                                disabled={actionMode === 'edit'}
                                loading={loadingInvoices}
                                style={{ width: '100%' }}
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.children || '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {invoices.map((invoice) => (
                                    <Select.Option key={invoice.invoices_id} value={invoice.invoices_id}>
                                        {invoice.label || `Invoice #${invoice.invoices_id}`}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <Text strong>Type Payment</Text>
                        <Text style={{ color: 'red' }}> *</Text>
                        {isReadOnly ? (
                            <Input
                                value={formData.type_payment}
                                disabled
                                style={{ backgroundColor: '#f5f5f5', textTransform: 'uppercase' }}
                            />
                        ) : (
                            <Select
                                name="type_payment"
                                value={formData.type_payment}
                                onChange={(value) => handleSelectChange('type_payment', value)}
                                placeholder="Select Payment Type"
                                style={{ width: '100%' }}
                                allowClear
                            >
                                {paymentTypeOptions.map((type) => (
                                    <Select.Option key={type.value} value={type.value}>
                                        {type.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default DetailPembayaran;