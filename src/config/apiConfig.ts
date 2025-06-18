export const apiConfig = {
  baseUrl: 'https://aqa-course-project.app/',
  endpoints: {
    ['Login']: '/api/login',
    ['Customers']: '/api/customers',
    ['Get Customer By Id']: (id: string) => `/api/customers/${id}`,
    ['Products']: '/api/products',
    ['Get Product By Id']: (id: string) => `/api/products/${id}`,
    ['Orders']: '/api/orders',
    ['Get Order By Id']: (id: string) => `/api/orders/${id}`,
    ['Order Delivery']: '/api/orders/delivery',
    ['Order Receive']: '/api/orders/receive',
    ['Order Status']: '/api/orders/status',
    ['Order Comments']: '/api/orders/comments',
  },
};

export function getCustomersUrlRegex() {
  const url = `${apiConfig.baseUrl}${apiConfig.endpoints.Customers}`;
  return new RegExp(`^${url}(\\?.*)?$`);
}
