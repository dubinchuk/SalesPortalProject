export const TOAST_MESSAGES = {
  CUSTOMER: {
    CREATED: 'Customer was successfully created',
    DELETED: 'Customer was successfully deleted',
    UPDATED: 'Customer was successfully updated',
    EXISTS: (email: string) => `Customer with email '${email}' already exists`,
  },
  PRODUCT: {
    CREATED: 'Product was successfully created',
    DELETED: 'Product was successfully deleted',
    UPDATED: 'Product was successfully updated',
  },
  ORDER: {
    CREATED: 'Order was successfully created',
  },
};
