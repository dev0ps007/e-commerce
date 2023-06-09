import orderModel from '../models/order.model.js';

class OrdersService {
  async findOrderById(id) {
    return await orderModel.findById(id).agg.lean().populate('customer', '-password').populate('products.product');
  }

  async findAllOrders(queryObject, userId) {
    let query = {};
    let pageNumber = 1;
    const pageSize = process.env.PAGE_SIZE;
    if (userId) {
      query.customer = userId;
    } else if (queryObject.page) {
      pageNumber = +queryObject.page;
    } else if (queryObject.minPrice) {
      query.subTotalPrice = { $gte: queryObject.minPrice };
    } else if (queryObject.maxPrice) {
      query.subTotalPrice = { $lte: queryObject.maxPrice };
    } else if (queryObject.status) {
      query.status = queryObject.status;
    }
    return await orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize)
      .lean()
      .populate('customer', '-password')
      .populate('products.product');
  }

  async createOrder(orderData) {
    const newOrder = await orderModel.create(orderData);
    await newOrder.save();
    return await newOrder.populate('products.product');
  }

  async updateOrder(id, orderData) {
    return await orderModel
      .findByIdAndUpdate(id, orderData, { returnDocument: 'after' })
      .lean()
      .populate('customer', '-password')
      .populate('products.product');
  }

  async deleteOrder(id) {
    return await orderModel.findByIdAndDelete(id).lean().populate('customer', '-password').populate('products.product');
  }

  async updateOrderStatus(id, status) {
    return await orderModel
      .findByIdAndUpdate(id, { $set: { status } }, { returnDocument: 'after' })
      .lean()
      .populate('customer', '-password')
      .populate('products.product');
  }

  async updateOrderSubTotalPrice(id, subTotalPrice) {
    return await orderModel
      .findByIdAndUpdate(id, { $set: { subTotalPrice } }, { returnDocument: 'after' })
      .lean()
      .populate('customer', '-password')
      .populate('products.product');
  }
}

export default new OrdersService();
