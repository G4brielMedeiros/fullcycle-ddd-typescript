import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

const product = new Product("123", "product1", 14.99)

const input = {
    id: product.id,
    name: "product1 updated",
    price: 99.99
}

const MockProductRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit test product update use case", () => {

    it("should update a product", async () => {
        const productRepository = MockProductRepository();
        const updateProductUseCase = new UpdateProductUseCase(productRepository);

        const output = await updateProductUseCase.execute(input)

        expect(output).toEqual(input);
    })
})