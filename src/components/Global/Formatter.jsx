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
        console.error('Decrypt Error:', error);
        return { error: true, message: `Decrypt Error: ${error.message}` };
    }
};

const getSessionData = () => {
    try {
        const ciphertext = localStorage.getItem('session');
        if (!ciphertext) {
            console.log('getSessionData: No session found in localStorage');
            return { error: true, message: 'No session found' };
        }
        
        console.log('getSessionData: Session found, decrypting...');
        const decrypted = decryptData(ciphertext);
        
        if (decrypted?.error) {
            console.log('getSessionData: Decryption failed:', decrypted.message);
            return decrypted;
        }
        
        console.log('getSessionData: Successfully decrypted session');
        return decrypted;
    } catch (error) {
        console.error('getSessionData Error:', error);
        return { error: true, message: error.message };
    }
};

// ========== FUNGSI AUTH ==========
const setUserSession = (userData, token) => {
    try {
        console.log('=== setUserSession called ===');
        console.log('User Data:', userData);
        console.log('Token:', token);

        if (!userData) {
            console.error('setUserSession: userData is null or undefined');
            return false;
        }

        // Pastikan userData memiliki semua properti yang diperlukan
        const sessionData = {
            user: userData,
            token: token || userData.token || null,
            role_name: userData.role_name || userData.role || null,
            users_id: userData.users_id || userData.id || null,
            fullname: userData.fullname || userData.name || userData.full_name || '',
            username: userData.username || userData.user_name || '',
            email: userData.email || ''
        };

        console.log('Session data to encrypt:', sessionData);

        const encryptedSession = encryptData(sessionData);
        if (!encryptedSession) {
            console.error('setUserSession: Failed to encrypt session');
            return false;
        }

        // Simpan ke localStorage
        localStorage.setItem('session', encryptedSession);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }

        console.log('Session saved successfully');
        console.log('localStorage session length:', encryptedSession.length);
        console.log('localStorage user:', localStorage.getItem('user'));
        console.log('localStorage token:', localStorage.getItem('token'));

        // Verifikasi penyimpanan
        const verifySession = localStorage.getItem('session');
        console.log('Verification - session exists:', !!verifySession);

        return true;
    } catch (error) {
        console.error('Error saving session:', error);
        return false;
    }
};

const clearUserSession = () => {
    console.log('Clearing user session...');
    localStorage.removeItem('session');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('Session cleared');
};

const getUserData = () => {
    try {
        // Coba dari session terlebih dahulu
        const session = getSessionData();
        if (session && !session.error && session.user) {
            console.log('getUserData: From session');
            return session.user;
        }

        // Fallback ke localStorage user
        const user = localStorage.getItem('user');
        if (!user) {
            console.log('getUserData: No user data found');
            return null;
        }
        
        const userData = JSON.parse(user);
        console.log('getUserData: From localStorage');
        return userData;
    } catch (error) {
        console.error('getUserData Error:', error);
        return null;
    }
};

const getUserRole = () => {
    try {
        const user = getUserData();
        if (!user) {
            console.log('getUserRole: No user data');
            return null;
        }
        
        const role = user?.role_name || user?.role || null;
        console.log('getUserRole:', role);
        return role;
    } catch (error) {
        console.error('getUserRole Error:', error);
        return null;
    }
};

const isAdminOrOwner = () => {
    const role = getUserRole();
    const result = role === 'Admin' || role === 'Owner' || role === 'Super Admin';
    console.log('isAdminOrOwner:', { role, result });
    return result;
};

const isSuperAdmin = () => {
    const role = getUserRole();
    const result = role === 'Super Admin';
    console.log('isSuperAdmin:', { role, result });
    return result;
};

const isAuthenticated = () => {
    const session = getSessionData();
    const isValid = session && !session.error;
    console.log('isAuthenticated:', isValid);
    return isValid;
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
    setUserSession,
    clearUserSession,
    getUserData,
    getUserRole,
    isAdminOrOwner,
    isSuperAdmin,
    isAuthenticated,
};