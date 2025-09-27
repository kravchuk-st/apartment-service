import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { JWTPayload } from 'src/auth/models/auth.model';
import { ROLE } from 'src/model/role.model';
import { Order, OrderDocument } from './schemas/order.schema';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ProductService } from 'src/product/product.service';
import {
  CreateOrderItemType,
  ORDER_STATUS,
  OrderType,
  UpdateOrderStatusOption,
} from 'src/model/order.model';
import { UserService } from 'src/user/user.service';
import { OrderItem, OrderItemDocument } from './schemas/order-item.schema';
import { OrderItemDTO } from './dto/order-item.dto';
import { ProductSold, ProductType } from 'src/model/product.model';
import { OrderItem as OrderItemType } from 'src/model/order.model';
import { PaymentDetails } from 'src/model/payment.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderDetailModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItemDocument>,
    @InjectConnection() private readonly connection: Connection,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  async create(
    { orders, ...createOrderDto }: CreateOrderDto,
    payload: JWTPayload,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const user = await this.userService.findOneByEmail(
        createOrderDto.phoneNumber,
      );

      const orderDto = new CreateOrderDto({
        ...createOrderDto,
        creatorId: new Types.ObjectId(payload.userId),
        userId: user ? user._id : null,
        status: ORDER_STATUS.PENDING,
        payment: null,
        orders: [],
      });
      const newOrder = new this.orderDetailModel(orderDto);

      if (orders && orders.length > 0) {
        const orderItems = await this.createOrderItems({
          orders,
          userId: payload.userId,
          session,
        });
        newOrder.orders.push(...orderItems);
      }

      const order = await newOrder.save({ session });
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await session.endSession();
    }
  }

  async createOrderItems(dto: CreateOrderItemType) {
    const orderItemArray: Types.ObjectId[] = [];
    for (let i = 0; i < dto.orders.length; i++) {
      const element = dto.orders[i];
      const orderItemDTO = new OrderItemDTO({
        ...element,
        creatorId: new Types.ObjectId(dto.userId),
        productId: new Types.ObjectId(element.productId),
      });
      const orderItem = await this.createOrderItem(orderItemDTO, dto.session);
      orderItemArray.push(orderItem._id);
    }
    return await Promise.all(orderItemArray);
  }

  async createOrderItem(dto: OrderItemDTO, session: ClientSession) {
    try {
      const orderItemModel = new this.orderItemModel(dto);
      const savedOrderItem = await orderItemModel.save({ session });
      return savedOrderItem;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateStatus(id: string, option: UpdateOrderStatusOption) {
    try {
      const updOrder = (await this.orderDetailModel
        .findById(id)
        .populate('orders')
        .populate('payment')
        .exec()) as unknown as OrderType;
      if (!updOrder) return new NotFoundException('order not found');
      const orderChanged = {
        status: updOrder.status,
        payment: updOrder.payment,
      };

      if (
        option.status === ORDER_STATUS.COMPLETE ||
        option.status === ORDER_STATUS.INPROGRESS
      ) {
        orderChanged.status = option.status;
        for (let i = 0; i < updOrder.orders.length; i++) {
          const elem = updOrder.orders[i];
          const product = (await this.productService.findOne(
            elem.productId.toString(),
            {
              size: elem.size,
              color: elem.color,
            },
          )) as unknown as ProductType;

          if (!product) {
            throw new NotFoundException(
              `Product with id ${elem.productId} not found`,
            );
          }

          const productSoldOption = this.makeProductSoldOption(
            product,
            elem,
            option.userId,
          );

          const sold = await this.productService.productSold(
            productSoldOption,
            option.session,
          );
        }

        if (option.paymentId) {
          orderChanged.payment = new Types.ObjectId(
            option.paymentId,
          ) as unknown as PaymentDetails;
        }
      }
      const result = await this.orderDetailModel
        .findByIdAndUpdate(
          id,
          {
            $set: orderChanged,
          },
          { new: true },
        )
        .exec();

      if (!result) throw new BadRequestException('Error with updating status!');

      return result;
    } catch (error) {
      return new BadRequestException('Error with updating status!');
    }
  }

  async remove(id: string, payload: JWTPayload) {
    const result = await this.orderDetailModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('order not found');
    return true;
  }

  findAll(payload: JWTPayload) {
    if (payload.role === ROLE.USER || payload.role === ROLE.WORKER) {
      return this.orderDetailModel.find({ userId: payload.userId }).exec();
    } else {
      return this.orderDetailModel.find().exec();
    }
  }

  getAll() {
    return this.orderDetailModel.find().exec();
  }

  async findOne(id: string, payload: JWTPayload) {
    try {
      if (payload.role === ROLE.USER || payload.role === ROLE.WORKER) {
        const order = await this.orderDetailModel
          .findOne({
            id,
            userId: payload.userId,
          })
          .populate('payment')
          .populate('orders')
          .exec();
        if (!order) return new NotFoundException('order not found');
        return order;
      } else {
        const order = await this.orderDetailModel
          .findById(id)
          .populate('payment')
          .populate('orders')
          .exec();
        if (!order) return new NotFoundException('order not found');
        return order;
      }
    } catch (error) {
      throw new BadRequestException('error:' + error.message || error.error);
    }
  }

  private makeProductSoldOption(
    product: ProductType,
    order: OrderItemType,
    userId: string,
  ): ProductSold {
    const productSize = product.sizes[0];
    const productColor = productSize.colors.find(
      (color) => color.stock >= order.quantity && color.color === order.color,
    );

    return {
      quantity: order.quantity,
      userId: userId,
      productId: product._id,
      sizeId: productSize._id,
      colorId: productColor._id,
    } as ProductSold;
  }
}
