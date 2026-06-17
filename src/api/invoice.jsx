import { SendRequest } from '../components/Global/ApiRequest';

const listInvoices = async (queryParams) => {
    const response = await SendRequest({
        method: 'get',
        prefix: `invoices?${queryParams.toString()}`,
    });

    return response.data;
};

const detailInvoices = async (id) => {
    const response = await SendRequest({
        method: 'get',
        prefix: `invoices/${id}`,
    });

    return response.data;
};

const deleteInvoices = async (id) => {
    const response = await SendRequest({
        method: 'delete',
        prefix: `invoices/${id}`,
    });

    return response.data;
};

const createInvoices = async (queryParams) => {
    const response = await SendRequest({
        method: 'post',
        prefix: `invoices`,
        params: queryParams,
    });

    return response.data;
};


export { listInvoices, detailInvoices, deleteInvoices, createInvoices};