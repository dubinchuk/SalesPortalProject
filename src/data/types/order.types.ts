import { IResponseFields } from './api.types';
import { COUNTRIES, ICustomerFromResponse } from './customers.types';
import { IProduct } from './product.types';

export enum ORDER_STATUSES {
  DRAFT = 'Draft',
  IN_PROCESS = 'In Process',
  PARTIALLY_RECEIVED = 'Partially Received',
  RECEIVED = 'Received',
  CANCELED = 'Canceled',
}

export enum DELIVERY_CONDITIONS {
  DELIVERY = 'Delivery',
  PICKUP = 'Pickup',
}

export enum ORDER_ACTIONS {
  ORDER_CREATED = 'Order created',
  CUSTOMER_CHANGED = 'Customer changed',
  REQUESTED_PRODUCTS_CHANGED = 'Requested products changed',
  ORDER_PROCESSING_STARTED = 'Order processing started',
  DELIVERY_SCHEDULED = 'Delivery Scheduled',
  DELIVERY_EDITED = 'Delivery Edited',
  RECEIVED = 'Received',
  RECEIVED_ALL = 'Received All',
  ORDER_CANCELED = 'Order canceled',
}

export interface IOrder {
  customer: string;
  products: string[];
}

export interface IOrderDeliveryFromResponse {
  address: {
    country: COUNTRIES;
    city: string;
    street: string;
    house: number;
    flat: number;
  };
  finalDate: string;
  condition: DELIVERY_CONDITIONS;
}

export interface IOrderPerformerFromResponse {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdOn: string;
}

export interface IProductInOrder extends IProduct {
  _id: string;
  received: boolean;
}

export interface IOrderHistoryFromResponse {
  status: ORDER_STATUSES;
  customer: string;
  products: IProductInOrder[];
  total_price: number;
  delivery: IOrderDeliveryFromResponse | null;
  changeOn: string;
  action: ORDER_ACTIONS;
  performer: IOrderPerformerFromResponse;
  assignedManager: string | null;
}

export interface IOrderCommentFromResponse {
  text: string;
  createdOn: string;
  _id: string;
}

export interface IOrderFromResponse {
  _id: string;
  status: ORDER_STATUSES;
  customer: ICustomerFromResponse;
  products: IProductInOrder[];
  total_price: number;
  createdOn: string;
  delivery: IOrderDeliveryFromResponse | null;
  comments: IOrderCommentFromResponse[];
  history: IOrderHistoryFromResponse[];
  assignedManager: string | null;
}

export interface IOrderResponse extends IResponseFields {
  Order: IOrderFromResponse;
}

export interface IOrdersResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
  total: number;
  page: number;
  limit: number;
  search: string;
  status: string[];
  sorting: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  };
}
