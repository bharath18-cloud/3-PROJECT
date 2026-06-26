import axios from 'axios';

// Create instances targeting Node server base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject Bearer JWT on requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('st_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authorization expiries
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('st_token');
      localStorage.removeItem('st_user');
      // Redirect to auth if in browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (details) => {
    const res = await api.post('/auth/register', details);
    return res.data;
  },
  verifyOtp: async (otpPayload) => {
    const res = await api.post('/auth/verify-otp', otpPayload);
    return res.data;
  },
  forgotPassword: async (payload) => {
    const res = await api.post('/auth/forgot-password', payload);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const productService = {
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(`/products?${params}`);
    return res.data;
  },
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  createProduct: async (data) => {
    const res = await api.post('/products', data);
    return res.data;
  },
  updateProduct: async (id, data) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

export const orderService = {
  createOrder: async (data) => {
    const res = await api.post('/orders', data);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get('/orders/my-orders');
    return res.data;
  },
  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  updateOrderStatus: async (id, statusData) => {
    const res = await api.put(`/orders/${id}/status`, statusData);
    return res.data;
  },
  getInvoice: async (id) => {
    const res = await api.get(`/orders/${id}/invoice`);
    return res.data;
  },
};

export const paymentService = {
  checkout: async (amount) => {
    const res = await api.post('/payment/checkout', { amount });
    return res.data;
  },
  verify: async (verificationData) => {
    const res = await api.post('/payment/verify', verificationData);
    return res.data;
  },
};

export const adminService = {
  getMetrics: async () => {
    const res = await api.get('/admin/metrics');
    return res.data;
  },
  getCustomers: async () => {
    const res = await api.get('/admin/customers');
    return res.data;
  },
};

export default api;
