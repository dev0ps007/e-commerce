import paymentModel from '../models/payment.model.js';

class PaymentsService {
  async findPaymentById(paymentId) {
    return await paymentModel.findOne({ paymentId }).lean();
  }

  async findAllPayments(userId, page) {
    let pageNumber = 1;
    const pageSize = process.env.PAGE_SIZE;
    if (page) {
      pageNumber = +page;
    }
    return await paymentModel
      .find({ customer: userId })
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize)
      .lean();
  }

  async createPayment(paymentData) {
    const newPayment = await paymentModel.create(paymentData);
    return await newPayment.save();
  }
}

export default new PaymentsService();
