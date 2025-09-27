import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentDetailDTO } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types, ClientSession } from 'mongoose';
import { PaymentDetail, PaymentDetailDocument } from './schemas/payment-detail.schema';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { JWTPayload } from 'src/model/auth.model';
import { PaymentStatus } from 'src/model/payment.model';
import { OrderService } from 'src/order/order.service';
import { ORDER_STATUS } from 'src/model/order.model';
import { PaymentDTO } from './dto/payment.dto';

@Injectable()
export class PaymentService {

  constructor(
    @InjectModel(PaymentDetail.name) private readonly paymentDetailModel: Model<PaymentDetailDocument>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @InjectConnection() private readonly connection: Connection,
    private orderService: OrderService
  ) { }


  async createPaymentDetail(dto: PaymentDetailDTO, payload: JWTPayload) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const userId = new Types.ObjectId(payload.userId);

      const paymentModel = new this.paymentModel({
        amount: dto.amount,
        method: dto.method,
        creatorId: userId,
        currency: dto.currency,
      });

      const paymentDetailModel = new this.paymentDetailModel({
        status: dto.debt === 0 ? PaymentStatus.PAID : PaymentStatus.HALF,
        orderId: new Types.ObjectId(dto.orderId),
        paid: [paymentModel._id],
        debt: dto.debt,
        payOffDate: dto.payOffDate,
        amount: dto.amount
      }) as PaymentDetailDocument;

      const orderStatus = dto.debt === 0 ? ORDER_STATUS.COMPLETE : ORDER_STATUS.INPROGRESS;

      await this.orderService.updateStatus(dto.orderId, {
        status: orderStatus,
        userId: payload.userId,
        paymentId: paymentDetailModel._id.toString(),
        session: session
      });


      await paymentModel.save({ session });
      const paymentDetail = await paymentDetailModel.save({ session });

      await session.commitTransaction();
      return paymentDetail;

    } catch (error) {
      await session.abortTransaction();
      throw error;

    } finally {
      await session.endSession();
    }
  }

  async createPayment(paymentDetailId: string, dto: PaymentDTO, payload: JWTPayload) {
    const session = await this.connection.startSession()
    session.startTransaction()
    try {
      const isCancelMode = dto.status === PaymentStatus.CANCELED;
      const payment = new this.paymentModel({
        amount: isCancelMode ? -dto.amount : dto.amount,
        creatorId: new Types.ObjectId(payload.userId),
        method: dto.method,
        currency: dto.currency,
      });
      const paymentDetail = await this.paymentDetailModel.findById(paymentDetailId);
      const updObj = {
        paid: [...paymentDetail.paid, payment._id],
        amount: isCancelMode ? paymentDetail.amount - dto.amount : paymentDetail.amount + dto.amount,
        debt: isCancelMode ? paymentDetail.debt + dto.amount : paymentDetail.debt - dto.amount,
      } as PaymentDetail

      if (updObj.debt >= 0) {
        updObj.status = PaymentStatus.PAID
      }

      const id = new Types.ObjectId(paymentDetailId);
      const result = await this.paymentDetailModel.updateOne({ _id: id }, {
        $set: updObj
      }, { session, new: true });
      if (!result) throw new BadRequestException('Error with creating payment!')

      const newPayment = await payment.save({ session });
      await session.commitTransaction()
      return newPayment
    } catch (error) {
      await session.abortTransaction()
      throw new BadRequestException('Error with creating payment!')
    } finally {
      await session.endSession();
    }
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  async remove(id: string) {
    try {
      // const result = await this.findAllPaymentDetails
    } catch (error) {
      throw new BadRequestException('Error with removing payment!')
    }
  }

  findAllPaymentDetails() {
    return this.paymentDetailModel.find().populate('paid').exec();
  }

  async findOne(id: string) {
    try {
      const payment = await this.paymentDetailModel.findById(id).populate('paid').exec();
      if (!payment) return new NotFoundException('Payment not found');
      return payment;
    } catch (error) {
      return new ForbiddenException(error.message || error.error || 'Error with finding payment!');
    }
  }
}
