import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
    "alice",
    new Address("street1", 123, "zip1", "city1")
);

const customer2 = CustomerFactory.createWithAddress(
    "bob",
    new Address("street2", 1232, "zip2", "city2")
);


const MockCustomerRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("unit test list customer use case", () => {

    it("should list customers", async () => {
        const repository = MockCustomerRepository();
        const usecase = new ListCustomerUseCase(repository);
        const output = await usecase.execute({});


        expect(output.customers.length).toBe(2)
        expect(output.customers[0].id).toBe(customer1.id)
        expect(output.customers[0].name).toBe(customer1.name)
        expect(output.customers[0].address.street).toBe(customer1.Address.street)
        expect(output.customers[1].id).toBe(customer2.id)
        expect(output.customers[1].name).toBe(customer2.name)
        expect(output.customers[1].address.street).toBe(customer2.Address.street)
    })
})