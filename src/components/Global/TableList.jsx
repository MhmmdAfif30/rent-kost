import React, { memo, useState, useEffect, useRef } from 'react';
import { Table, Pagination, Row, Col, Card, Grid, Button, Typography, Tag, Segmented } from 'antd';
import { NotifAlert } from '../../components/Global/ToastNotif';
import { MacCommandOutlined, TableOutlined } from '@ant-design/icons';
import CardList from './CardList';

const { Text } = Typography;

const TableList = memo(function TableList({
    getData,
    queryParams,
    columns,
    triger,
    mobile,
    rowSelection = null,
    header = 'name',
    showPreviewModal,
    showEditModal,
    showDeleteDialog,
    cardColor,
    fieldColor,
    firstLoad = true,
    columnDynamic = false,
    cardComponent,
    onStockUpdate,
    onGetData,
}) {
    const [gridLoading, setGridLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        current_limit: 10,
        total_limit: 0,
        total_page: 1,
    });
    const [columnsDynamic, setColumnsDynamic] = useState(columns);
    const [viewMode, setViewMode] = useState('table');
    const { useBreakpoint } = Grid;
    const [renderCount, setRenderCount] = useState(firstLoad ? 1 : 0);

    useEffect(() => {
        if (renderCount < 1) {
            setRenderCount(renderCount + 1);
            return;
        } else {
            filter(1, pagination.current_limit);
        }
    }, [triger]);

    const filter = async (currentPage, pageSize) => {
        setGridLoading(true);

        try {
            const paging = {
                page: Number(currentPage),
                limit: Number(pageSize),
            };

            const param = new URLSearchParams({ ...paging, ...queryParams });
            const resData = await getData(param);

            // EKSTRAK DATA DENGAN AMAN
            let fetchedData = [];
            
            if (resData) {
                // Jika response langsung array
                if (Array.isArray(resData)) {
                    fetchedData = resData;
                }
                // Jika response memiliki properti 'data'
                else if (resData.data && Array.isArray(resData.data)) {
                    fetchedData = resData.data;
                }
                // Jika response memiliki properti 'records'
                else if (resData.records && Array.isArray(resData.records)) {
                    fetchedData = resData.records;
                }
                // Jika response memiliki properti 'items'
                else if (resData.items && Array.isArray(resData.items)) {
                    fetchedData = resData.items;
                }
                // Jika response memiliki properti 'results'
                else if (resData.results && Array.isArray(resData.results)) {
                    fetchedData = resData.results;
                }
                // Cari properti pertama yang berupa array
                else {
                    for (const key in resData) {
                        if (Array.isArray(resData[key])) {
                            fetchedData = resData[key];
                            break;
                        }
                    }
                }
            }

            // PASTIKAN fetchedData adalah array
            if (!Array.isArray(fetchedData)) {
                console.warn('Data is not an array:', fetchedData);
                fetchedData = [];
            }

            // Proses column dynamic
            if (columnDynamic && resData) {
                const columnsApi = resData[columnDynamic] ?? '';
                const colArray = columnsApi.split(',').map((c) => c.trim());

                const defaultColumns = [
                    {
                        title: 'No',
                        key: 'no',
                        width: '5%',
                        align: 'center',
                        render: (_, __, index) => index + 1,
                    },
                    {
                        title: 'Datetime',
                        dataIndex: 'datetime',
                        key: 'datetime',
                        width: '15%',
                    },
                ];

                const numericColumns = colArray.map((colName) => ({
                    title: colName,
                    dataIndex: colName,
                    key: colName,
                    align: 'right',
                    width: 'auto',
                    render: (value) => {
                        if (typeof value === 'number') {
                            return value.toFixed(4);
                        }
                        return value ?? '-';
                    },
                }));

                setColumnsDynamic([...defaultColumns, ...numericColumns]);
            }

            // Panggil callback jika disediakan
            if (onGetData && typeof onGetData === 'function') {
                onGetData(fetchedData);
            }

            setData(fetchedData);

            // Ekstrak pagination
            const pagingData = resData?.paging;
            if (pagingData) {
                setPagination((prev) => ({
                    ...prev,
                    current_page: pagingData.current_page || 1,
                    current_limit: pagingData.current_limit || 10,
                    total_limit: pagingData.total_limit || 0,
                    total_page: pagingData.total_page || 1,
                }));
            } else if (resData?.total_data) {
                // Jika total_data ada di root
                setPagination((prev) => ({
                    ...prev,
                    current_page: currentPage,
                    current_limit: pageSize,
                    total_limit: resData.total_data || 0,
                    total_page: Math.ceil((resData.total_data || 0) / pageSize),
                }));
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
            NotifAlert?.({
                icon: 'error',
                title: 'Error',
                message: 'Gagal memuat data',
            });
        } finally {
            setGridLoading(false);
        }
    };

    const handlePaginationChange = (page, pageSize) => {
        setPagination((prev) => ({
            ...prev,
            current: page,
            limit: pageSize,
        }));
        filter(page, pageSize);
    };

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const CardViewComponent = cardComponent || CardList;

    return (
        <div>
            <Segmented
                options={[
                    { value: 'table', icon: <TableOutlined /> },
                    { value: 'card', icon: <MacCommandOutlined /> },
                ]}
                value={viewMode}
                onChange={setViewMode}
            />
            
            {(isMobile && mobile) || viewMode === 'card' ? (
                <CardViewComponent
                    cardColor={cardColor}
                    fieldColor={fieldColor}
                    data={data}
                    column={columnsDynamic}
                    header={header}
                    showPreviewModal={showPreviewModal}
                    showEditModal={showEditModal}
                    showDeleteDialog={showDeleteDialog}
                    onStockUpdate={onStockUpdate}
                />
            ) : (
                <Row gutter={24} style={{ marginTop: '16px' }}>
                    <Table
                        rowSelection={rowSelection || null}
                        columns={columnsDynamic}
                        dataSource={data.map((item, index) => ({ ...item, key: index }))}
                        pagination={false}
                        loading={gridLoading}
                        scroll={{ y: 520 }}
                        size="small"
                    />
                </Row>
            )}

            {/* PAGINATION */}
            <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
                <Col>
                    <div>
                        Menampilkan {pagination.current_limit} data halaman{' '}
                        {pagination.current_page} dari total {pagination.total_limit} data
                    </div>
                </Col>
                <Col>
                    <Pagination
                        showSizeChanger
                        onChange={handlePaginationChange}
                        onShowSizeChange={handlePaginationChange}
                        current={pagination.current_page}
                        pageSize={pagination.current_limit}
                        total={pagination.total_limit}
                    />
                </Col>
            </Row>
        </div>
    );
});

export default TableList;