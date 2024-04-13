import EventDispatcher from "../../../@shared/event/event-dispatcher";
import Address from "../../value-object/address";
import CustomerChangedAddressEvent from "../customer-changed-address.event";
import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog1Handler from "./envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./envia-console-log-2.handler";
import EnviaConsoleLogHandler from "./envia-console-log.handler";

describe("Customer EventHandler Tests", () => {

  it("should print details from the CustomerChangeAddressEvent", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    const customerChangedAddressEvent = new CustomerChangedAddressEvent(
      {
        id: "customerId",
        name: "customerName",
        address: new Address("street", 123, "12345", "city")
      }
    );

    const logSpy = jest.spyOn(global.console, 'log');

    eventDispatcher.notify(customerChangedAddressEvent);

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('Endereço do cliente: customerId, customerName alterado para: street, 123, 12345 city');

    logSpy.mockRestore();
  });

  it("should log (first time) details from the CustomerChangeAddressEvent when its notified", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLog1Handler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent(
      {
        id: "customerId",
      }
    );

    const logSpy = jest.spyOn(global.console, 'log');

    eventDispatcher.notify(customerCreatedEvent);

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');

    logSpy.mockRestore();
  });

  it("should log (second time) details from the CustomerChangeAddressEvent when its notified", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent(
      {
        id: "customerId",
      }
    );

    const logSpy = jest.spyOn(global.console, 'log');

    eventDispatcher.notify(customerCreatedEvent);

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('Esse é o segundo console.log do evento: CustomerCreated');

    logSpy.mockRestore();
  });

});
