import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import { InputCreateCustomerDTO } from "../create/create.customer.dto";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
    "john", 
    new Address("street", 123, "zip", "city")
);

const input = {
    id: customer.id,
    name: "john 1",
    address: {
        street: "new street",
        number: 2345,
        zip: "new zip",
        city: "new city"
    }
}

const MockCustomerRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit test customer update use case", () => {
  
    it("should update a customer", async () => {
      const customerRepository = MockCustomerRepository();
      const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

      const output = await updateCustomerUseCase.execute(input)

      expect(output).toEqual(input);
    })
})