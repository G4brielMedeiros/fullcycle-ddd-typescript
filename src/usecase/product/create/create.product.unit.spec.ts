import CreateProductUseCase from "./create.product.usecase";

const input = {
    id: "123",
    name: "product name",
    price: 99.99
};


const MockProductRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    };
};


describe("Unit test create product use case", () => {
    it("should create product", async () => {
        const productRepository = MockProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        const output = await createProductUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        })
    });

    it("should throw error when name missing", async () => {
        const productRepository = MockProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        input.name = "";

        await expect(createProductUseCase.execute(input))
            .rejects.toThrow("Name is required");
    })

    it("should throw error when price is negative", async () => {
        const productRepository = MockProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        input.name = "product name";
        input.price = -1;

        await expect(createProductUseCase.execute(input))
            .rejects.toThrow("Price must be greater than zero");
    })
})