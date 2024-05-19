import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("123", "product1", 49.99);

const product2 = new Product("456", "product2", 14.99);


const MockProductRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("unit test list product use case", () => {

    it("should list products", async () => {
        const repository = MockProductRepository();
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