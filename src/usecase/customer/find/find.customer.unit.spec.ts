import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

const customer = CustomerFactory.createWithAddress("john", new Address("street", 123, "zip", "city"));

const MockCustomerRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit Test find customer usecase", () => {



    it("should find a customer", async () => {

        const customerRepository = MockCustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);
        await customerRepository.create(customer);

        const input = {
            id: customer.id
        }

        const expected = {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.Address.street,
                city: customer.Address.street,
                number: customer.Address.number,
                zip: customer.Address.zip,
            }
        }

        const output = await usecase.execute(input)

        expect(output).toEqual(expected)
    })

    it("should not find a customer", async () => {


        const customerRepository = MockCustomerRepository();
        customerRepository.find.mockImplementation(() => {
            throw new Error("Customer not found")
        })
        const usecase = new FindCustomerUseCase(customerRepository);

        const input = {
            id: customer.id
        }

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Customer not found")
    })
})
