export const TOAST_MESSAGES = {
  CUSTOMER: {
    CREATED: 'Customer was successfully created',
    DELETED: 'Customer was successfully deleted',
    EXISTS: (email: string) => `Customer with email '${email}' already exists`,
  },
  PRODUCT: {
    CREATED: 'Product was successfully created',
    DELETED: 'Product was successfully deleted',
  },
};
