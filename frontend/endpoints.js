// Match backend routes
export const BASE_URL = "http://localhost:8080";

// ✅ Product Endpoints
export const GET_PRODUCTS = `${BASE_URL}/api/products`;       // GET all
export const ADD_PRODUCT = `${BASE_URL}/api/products`;        // POST new
export const UPDATE_PRODUCT = (id) => `${BASE_URL}/api/products/${id}`; // PUT
export const DELETE_PRODUCT = (id) => `${BASE_URL}/api/products/${id}`; // DELETE
// --- Sales Endpoints ---
export const GET_SALES = `${BASE_URL}/api/sales`;
export const ADD_SALE = `${BASE_URL}/api/sales`;
export const UPDATE_SALE = (id) => `${BASE_URL}/api/sales/${id}`;
export const DELETE_SALE = (id) => `${BASE_URL}/api/sales/${id}`;
