// src/services/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Auth token injection ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');

        const response = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh,
        });

        localStorage.setItem('access_token', response.data.access);

        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);

      } catch (e) {
        // 🔥 FIXED (no redirect)
        console.log("Refresh token failed");
      }
    }

    return Promise.reject(err);
  }
);
export default api;

/* ─── PRODUCTS ─── */
export const productsAPI = {
  list:       (params) => api.get('/products/', { params }),
  detail:     (id)     => api.get(`/products/${id}/`),
  search:     (q)      => api.get('/products/', { params: { search: q } }),
  byCategory: (cat)    => api.get('/products/', { params: { category: cat } }),
  byVendor:   (vid)    => api.get('/products/', { params: { vendor: vid } }),
  create:     (data)   => api.post('/products/', data),
  update:     (id,d)   => api.put(`/products/${id}/`, d),
  delete:     (id)     => api.delete(`/products/${id}/`),
  categories: ()       => api.get('/products/categories/'),
};

/* ─── VENDORS ─── */
export const vendorsAPI = {
  list:   ()     => api.get('/vendors/'),
  detail: (id)   => api.get(`/vendors/${id}/`),
  register: (d)  => api.post('/vendors/register/', d),
  dashboard: ()  => api.get('/vendors/dashboard/'),
  stats: ()      => api.get('/vendors/stats/'),
};

/* ─── ORDERS ─── */
export const ordersAPI = {
  list:   ()    => api.get('/orders/'),
  detail: (id)  => api.get(`/orders/${id}/`),
  create: (d)   => api.post('/orders/', d),
  cancel: (id)  => api.post(`/orders/${id}/cancel/`),
  track:  (id)  => api.get(`/orders/${id}/track/`),
};

/* ─── CART ─── */
export const cartAPI = {
  get:    ()          => api.get('/cart/'),
  add:    (d)         => api.post('/cart/add/', d),
  remove: (itemId)    => api.delete(`/cart/remove/${itemId}/`),
  update: (itemId, d) => api.patch(`/cart/update/${itemId}/`, d),
  clear:  ()          => api.delete('/cart/clear/'),
};

/* ─── REVIEWS ─── */
export const reviewsAPI = {
  forProduct: (pid)  => api.get(`/reviews/?product=${pid}`),
  create:     (d)    => api.post('/reviews/', d),
  delete:     (id)   => api.delete(`/reviews/${id}/`),
};

/* ─── AUTH ─── */
export const authAPI = {
  login:    (d) => api.post('/auth/login/', d),
  register: (d) => api.post('/auth/register/', d),
  logout:   ()  => api.post('/auth/logout/'),
  me:       ()  => api.get('/auth/me/'),
  refresh:  ()  => api.post('/auth/token/refresh/'),
};

/* ─── AI ENDPOINTS ─── */
export const aiAPI = {
  // Personalized recommendations (SVD + TF-IDF hybrid)
  recommendations: (userId) => api.get(`/ai/recommendations/${userId}/`),
  // Trending / cold-start recommendations
  trending: (category) => api.get('/ai/trending/', { params: { category } }),
  // Fake review detection (BERT)
  detectFakeReview: (text) => api.post('/ai/review-detect/', { text }),
  // Batch detect fake reviews for a product
  batchDetect: (productId) => api.get(`/ai/review-detect/batch/${productId}/`),
};

/* ─── WISHLIST ─── */
export const wishlistAPI = {
  get:    ()    => api.get('/wishlist/'),
  add:    (pid) => api.post('/wishlist/', { product: pid }),
  remove: (pid) => api.delete(`/wishlist/${pid}/`),
};
