import { COUNTRIES } from '../../types/customers.types';

export const allCustomersSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          country: {
            type: 'string',
            enum: Object.values(COUNTRIES),
          },
          city: {
            type: 'string',
          },
          street: {
            type: 'string',
          },
          house: {
            type: 'number',
          },
          flat: {
            type: 'number',
          },
          phone: {
            type: 'string',
          },
          createdOn: {
            type: 'string',
            format: 'date-time',
          },
          notes: {
            type: 'string',
          },
        },
        required: [
          'email',
          'name',
          'country',
          'city',
          'street',
          'house',
          'flat',
          'phone',
          'createdOn',
        ],
        additionalProperties: false,
      },
    },
    IsSuccess: {
      type: 'boolean',
    },
    ErrorMessage: {
      type: ['string', 'null'],
    },
  },
  required: ['Customers', 'IsSuccess', 'ErrorMessage'],
};
