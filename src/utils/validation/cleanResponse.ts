import _ from 'lodash';

import { IResponse } from '../../data/types/api.types';
import { IOrderHistoryFromResponse, IOrderResponse } from '../../data/types/order.types';

export function omitChangedOnFields(response: IResponse<IOrderResponse>) {
  const cleanHistory = response.body.Order.history.map((item) => _.omit(item, ['changedOn']));

  const cleanResponse = {
    ...response,
    body: {
      ...response.body,
      Order: {
        ...response.body.Order,
        history: cleanHistory as IOrderHistoryFromResponse[],
      },
    },
  };

  return cleanResponse;
}
