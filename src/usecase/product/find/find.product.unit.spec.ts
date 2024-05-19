import FindProductUseCase from "./find.product.usecase";
import Product from "../../../domain/product/entity/product";

const product = new Product("123", "productName", 99.99)

const MockProductRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit Test find product usecase", () => {

    it("should find a product", async () => {

        const productRepository = MockProductRepository();
        const usecase = new FindProductUseCase(productRepository);
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

    it("should not find a product", async () => {


        const productRepository = MockProductRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found")
        })
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: product.id
        }

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Product not found")
    })
})
