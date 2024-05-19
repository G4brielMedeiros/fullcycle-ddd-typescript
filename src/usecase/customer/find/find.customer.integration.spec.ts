import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

describe("Test find customer usecase", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();


    });


    afterEach(async () => {
        await sequelize.close();
    });


    it("should find a customer", async () => {

        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);
        const customer = CustomerFactory.createWithAddress("john", new Address("street", 123, "zip", "city"));
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
})
