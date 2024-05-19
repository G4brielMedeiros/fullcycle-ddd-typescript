import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

const product = new Product("123", "product1", 14.99)

const input = {
    id: product.id,
    name: "product1 updated",
    price: 99.99
}

describe("Unit test product update use case", () => {


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
    })

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        productRepository.create(product);
        const updateProductUseCase = new UpdateProductUseCase(productRepository);

        const output = await updateProductUseCase.execute(input)

        expect(output).toEqual(input);
    })
})