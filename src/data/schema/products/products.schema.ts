import { MANUFACTURERS } from '../../types/product.types';

export const allProductsSchema = {
  type: 'object',
  properties: {
    Products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          amount: {
            type: 'integer',
          },
          price: {
            type: 'number',
          },
          manufacturer: {
            type: 'string',
            enum: Object.values(MANUFACTURERS),
          },
          createdOn: {
            type: 'string',
          },
          notes: {
            type: 'string',
          },
        },
        required: ['_id', 'name', 'amount', 'price', 'manufacturer', 'createdOn'],
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
  required: ['Products', 'IsSuccess', 'ErrorMessage'],
};
