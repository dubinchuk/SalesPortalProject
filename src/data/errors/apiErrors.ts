export const API_ERRORS = {
  CUSTOMER: {
    EXISTS: (email: string) => `Customer with email '${email}' already exists`,
  },
};

export const CUSTOM_API_ERRORS = {
  PRODUCT: {
    CREATE_FAILED:
      'Failed to create product - Status code: 400, IsSuccess: false, ErrorMessage: Incorrect request body',
  },
};
