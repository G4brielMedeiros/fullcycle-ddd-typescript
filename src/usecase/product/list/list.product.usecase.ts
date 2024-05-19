import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputListProductDTO, OutputListProductDTO } from "./list.product.dto";

export default class ListProductUseCase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputListProductDTO) {
        const products = await this.productRepository.findAll();
        return OutputMapper.toOutput(products);
    }
}

class OutputMapper {
    static toOutput(productList: Product[]): OutputListProductDTO {
        return {
            products: productList.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
            })),
        };
    }
}
