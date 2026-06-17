import { SendRequest } from '../components/Global/ApiRequest';

const listKost = async (params) => {
    const response = await SendRequest({
        method: 'get',
        prefix: `kost`,
        params: params,
    });
    return response;
};

const detailKost = async (params) => {
    const response = await SendRequest({
        method: 'get',
        prefix: 'kost/:id',
        params: params,
        headers: { 'Content-Type': 'application/json' },
    });
    return response || {};
};


export { listKost, detailKost};