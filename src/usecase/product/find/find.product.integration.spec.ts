import { Sequelize } from "sequelize-typescript"
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../domain/product/entity/product";

describe("Test find product usecase", () => {

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


    it("should find a product", async () => {

        const productRepository = new ProductRepository();
        const usecase = new FindProductUseCase(productRepository);
        const product = new Product("123", "productname", 99.99)
        await productRepository.create(product);

        const input = {
            id: product.id
        }

        const expected = {
            id: product.id,
            name: product.name,
            price: product.price
        }

        const output = await usecase.execute(input)

        expect(output).toEqual(expected)
    })
})
