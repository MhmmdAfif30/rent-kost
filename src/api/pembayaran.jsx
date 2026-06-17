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


export { listPembayaran, detailPembayaran, deletePembayaran};