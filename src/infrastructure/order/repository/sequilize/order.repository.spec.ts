import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  let product: Product;
  let orderItem: OrderItem;
  let order: Order;
  let customer: Customer;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();

    const customerRepository = new CustomerRepository();
    customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    product = new Product("123", "Product 1", 100);
    await productRepository.create(product);



    orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      1
    );

    order = new Order("123", "123", [orderItem]);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find an order", async () => {

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({ where: { id: "123" } });

    const foundOrder = await orderRepository.find("123");

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerId,
      total: foundOrder.total()
    });
  });

  it("should update an order", async () => {
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const customer2 = new Customer("customer2", "customer2");
    const address2 = new Address("street", 123, "12345", "city");
    customer2.changeAddress(address2);
    const customerRepository = new CustomerRepository();
    customerRepository.create(customer2);

    const newItem = new OrderItem("orderItem2", "orderItem2", 100, product.id, 1);

    const updatedOrder = new Order(order.id, customer2.id, [orderItem, newItem]);

    await orderRepository.update(updatedOrder);

    const orderModel = await OrderModel.findOne(
      {
        where: { id: order.id },
        include: ["items"],
      }
    );


    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: updatedOrder.customerId,
      total: updatedOrder.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: product.id,
        },

        {
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: newItem.quantity,
          order_id: order.id,
          product_id: product.id,
        },
      ],
    });

  });

  it("should find all orders", async() => {
    const orderItem2 = new OrderItem("orderItem2", "orderItem2", 100, product.id, 1);
    const order2 = new Order("order2", customer.id, [orderItem2]);
    const orderRepository = new OrderRepository();

    await orderRepository.create(order);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toEqual([order, order2])

  })
});
