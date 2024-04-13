import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address.event";
import CustomerCreatedEvent from "../customer-created.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerChangedAddressEvent>
{
  handle(event: CustomerCreatedEvent): void {
    const eventData = event.eventData;
    console.log(`Endereço do cliente: ${eventData.id}, ${eventData.name} alterado para: ${eventData.address}`);
  }
}
