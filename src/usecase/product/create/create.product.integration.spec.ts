import { Sequelize } from "sequelize-typescript";
import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const input = {
    id: "123",
    name: "product name",
    price: 99.99
};


describe("Unit test create product use case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });


    afterEach(async () => {
        await sequelize.close();
    });


    it("should create product", async () => {
        const productRepository = new ProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        const output = await createProductUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        })
    });

    it("should throw error when name missing", async () => {
        const productRepository = new ProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        input.name = "";

        await expect(createProductUseCase.execute(input))
            .rejects.toThrow("Name is required");


    })

    it("should throw error when price is negative", async () => {
        const productRepository = new ProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        input.name = "product name";
        input.price = -1;

        await expect(createProductUseCase.execute(input))
            .rejects.toThrow("Price must be greater than zero");
    })
})