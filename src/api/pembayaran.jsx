import { SendRequest } from '../components/Global/ApiRequest';

const listPembayaran = async (queryParams) => {
    const response = await SendRequest({
        method: 'get',
        prefix: `payments?${queryParams.toString()}`,
    });

    return response.data;
};

const detailPembayaran = async (id) => {
    const response = await SendRequest({
        method: 'get',
        prefix: `payments/${id}`,
    });

    return response.data;
};

const deletePembayaran = async (id) => {
    const response = await SendRequest({
        method: 'delete',
        prefix: `payments/${id}`,
    });

    return response.data;
};

const createPembayaran = async (queryParams) => {
    const response = await SendRequest({
        method: 'post',
        prefix: `payments`,
        params: queryParams,
    });

    return response.data;
};

 const updatePembayaran = async (id) => {

    const response = await SendRequest({
        method: 'post',
        prefix: `payments/sync/${id}`,
    });

    return response.data;
};

 const syncPaymentStatus = async (orderId) => {
    const response = await SendRequest({
        method: 'post',
        prefix: `payments/sync/${orderId}`,
    });

    return response.data;
};

export { listPembayaran, detailPembayaran, deletePembayaran, createPembayaran, updatePembayaran, syncPaymentStatus };