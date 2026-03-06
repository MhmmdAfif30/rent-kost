import { message } from 'antd';
import CryptoJS from 'crypto-js';

const secretKey = `${import.meta.env.VITE_KEY_SESSION}`;

const formatIDR = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const formatCurrencyUSD = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/[^0-9.]/g, ''); 
    const parts = numericValue.split('.'); 
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    return `${parts.join('.')}`; 
};

const formatCurrencyIDR = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const toApiNumberFormatter = (value) => {
    if (!value) return '';
    const formattedValue = value.replace(/[.,]/g, ''); 
    return Number(formattedValue);
};

const toAppDateFormatter = (value) => {
    const date = new Date(value);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
};

const toAppDateFormatterTwoDigit = (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
};

const toApiDateFormatter = (value) => {
    const parts = value.split('-');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
    }
    return '';
};

const toAppDateTimezoneFormatter = (value) => {
    const jakartaTimezone = 'Asia/Jakarta';
    const date = new Date(value);
    const options = { timeZone: jakartaTimezone };
    
    const day = new Intl.DateTimeFormat('en-US', { ...options, day: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { ...options, month: 'short' }).format(date);
    const year = new Intl.DateTimeFormat('en-US', { ...options, year: 'numeric' }).format(date);

    return `${day} ${month} ${year}`;
};

const toApiDateTimezoneFormatter = (value) => {
    const jakartaTimezone = 'Asia/Jakarta';
    const date = new Date(value);
    const options = { timeZone: jakartaTimezone };

    const day = new Intl.DateTimeFormat('en-US', { ...options, day: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { ...options, month: '2-digit' }).format(date);
    const year = new Intl.DateTimeFormat('en-US', { ...options, year: 'numeric' }).format(date);

    return `${year}-${month}-${day}`;
};

const encryptData = (data) => {
    try {
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        return ciphertext;
    } catch (error) {
        console.error('Encrypt Error:', error);
        return null;
    }
};

const decryptData = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (decrypted?.error) {
            decrypted.error = false;
        }
        return decrypted;
    } catch (error) {
        return { error: true, message: `Decrypt Error: ${error}` };
    }
};

const getSessionData = () => {
    try {
        const ciphertext = localStorage.getItem('session');
        if (!ciphertext) return { error: true };
        return decryptData(ciphertext);
    } catch (error) {
        return { error: true, message: error };
    }
};

export {
    formatIDR,
    formatCurrencyUSD,
    formatCurrencyIDR,
    toApiNumberFormatter,
    toAppDateFormatter,
    toApiDateFormatter,
    toAppDateTimezoneFormatter,
    toAppDateFormatterTwoDigit,
    toApiDateTimezoneFormatter,
    encryptData,
    getSessionData,
    decryptData,
};