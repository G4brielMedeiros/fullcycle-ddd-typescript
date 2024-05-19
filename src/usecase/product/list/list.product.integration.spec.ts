import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const product1 = new Product("123", "product1", 49.99);

const product2 = new Product("456", "product2", 14.99);

describe("unit test list product use case", () => {

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

    it("should list products", async () => {
        const repository = new ProductRepository();
        repository.create(product1);
        repository.create(product2);

        const usecase = new ListProductUseCase(repository);
        const output = await usecase.execute({});


        expect(output.products.length).toBe(2)
        expect(output.products[0].id).toBe(product1.id)
        expect(output.products[0].name).toBe(product1.name)
        expect(output.products[0].price).toBe(product1.price)
        expect(output.products[1].id).toBe(product2.id)
        expect(output.products[1].name).toBe(product2.name)
        expect(output.products[1].price).toBe(product2.price)
    })
})