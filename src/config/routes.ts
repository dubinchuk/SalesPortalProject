import { BASE_URL } from './environment';

export const urls = {
  baseUrl: BASE_URL,
  pages: {
    ['Login']: 'login',
    ['Home']: 'home',
    ['Customers List']: 'customers',
    ['Add Customer']: 'customers/add',
    ['Edit Customer']: (id: string) => `customers/${id}/edit`,
    ['Customer Details']: (id: string) => `customers/${id}`,
    ['Products List']: 'products',
    ['Add Product']: 'products/add',
    ['Edit Product']: (id: string) => `products/${id}/edit`,
    ['Orders List']: 'orders',
    ['Order Details']: (id: string) => `orders/${id}`,
    ['Schedule Order Delivery']: (id: string) => `orders/${id}/schedule-delivery`,
    ['Edit Order Delivery']: (id: string) => `orders/${id}/schedule-delivery`,
  },
};
