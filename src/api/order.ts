import api from './axios';

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface PlaceOrderPayload {
  items: OrderItem[];
}

export const placeOrder = (data: PlaceOrderPayload) =>
  api.post('/api/orders', data);
