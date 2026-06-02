// config/axios.js
import axios from 'axios';

const paystackAxios = axios.create({
    family: 4,  // Force IPv4 (works around broken IPv6)
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default paystackAxios;