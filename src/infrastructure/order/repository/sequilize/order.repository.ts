import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    await OrderModel.sequelize.transaction(async transaction => {


      const persistedItems = await OrderItemModel.findAll(
        {
          where: { order_id: entity.id },
          transaction
        }
      )

      // destroy all persisted items not included in the incoming items
      for (const persisted of persistedItems) {
        if (!entity.items.some((incomingItem) => incomingItem.id === persisted.id)) {
          await OrderItemModel.destroy({
            where: { id: persisted.id },
            transaction
          })
        }
      }

      for (const incomingItem of entity.items) {

        const isPersisted = persistedItems.find(persisted => persisted.id === incomingItem.id);

        // create or update item
        if (isPersisted) {
          await OrderItemModel.update(
            {
              name: incomingItem.name,
              price: incomingItem.price,
              product_id: incomingItem.productId,
              quantity: incomingItem.quantity,
            },
            {
              where: { id: incomingItem.id },
              transaction
            }
          )
        } else {
          await OrderItemModel.create(
            {
              id: incomingItem.id,
              name: incomingItem.name,
              price: incomingItem.price,
              product_id: incomingItem.productId,
              quantity: incomingItem.quantity,
              order_id: entity.id
            },
            { transaction }
          )
        }

      }


      // update the order itself
      await OrderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total()
        },
        {
          where: { id: entity.id },
          transaction
        }
      )

    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne(
      {
        where: { id },
        include: [{ model: OrderItemModel }]
      }
    );

    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(
        model => new OrderItem(
          model.id,
          model.name,
          model.price,
          model.product_id,
          model.quantity
        )
      )
    )
  }

  async findAll(): Promise<Order[]> {

    const orderModels = await OrderModel.findAll({ include: ["items"] });

    const orders = orderModels.map((orderModel) => {

      const itens = orderModel.items
        .map((modelItem) =>
          new OrderItem(
            modelItem.id,
            modelItem.name,
            modelItem.price,
            modelItem.product_id,
            modelItem.quantity
          )
        );

      return new Order(orderModel.id, orderModel.customer_id, itens);
    });

    return orders;
  }
}
