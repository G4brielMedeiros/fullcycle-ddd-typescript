import CreateCustomerUseCase from "./create.customer.usecase";

const input = {
    name: "Jown",
    address: {
        street: "Street",
        number: 123,
        zip: "zip",
        city: "city"
    },
};


const MockCustomerRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    };
};


describe("Unit test create customer use case", () => {
    it("should create customer", async () => {
        const customerRepository = MockCustomerRepository();
        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

        const output = await createCustomerUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                zip: input.address.zip,
                city: input.address.city
            }
        })
    });

    it("should throw error when name missing", async () => {
        const customerRepository = MockCustomerRepository();
        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

        input.name = "";

        await expect(createCustomerUseCase.execute(input))
            .rejects.toThrow("Name is required");


    })

    it("should throw error when street missing", async () => {
        const customerRepository = MockCustomerRepository();
        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

        input.address.street = "";

        await expect(createCustomerUseCase.execute(input))
            .rejects.toThrow("Street is required");


    })
})