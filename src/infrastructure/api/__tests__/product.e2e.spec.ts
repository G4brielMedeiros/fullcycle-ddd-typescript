import request from "supertest"
import { app, sequelize } from "../express"

describe("E2E test for product", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    })

    afterAll(async () => {
        await sequelize.close();
    })

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "product1",
                price: 14.99
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("product1")
        expect(response.body.price).toBe(14.99)
    })

    it("should not create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "product1"
            });

        expect(response.status).toBe(500);
    })

    it("should list all products", async () => {

        const response1 = await request(app)
            .post("/product")
            .send({
                name: "product1",
                price: 14.99

            });
        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/product")
            .send({
                name: "product2",
                price: 99.99
            });
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/product").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);
        const product = listResponse.body.products[0];
        expect(product.name).toBe("product1")
        expect(product.price).toBe(14.99)
        const product2 = listResponse.body.products[1];
        expect(product2.name).toBe("product2")
        expect(product2.price).toBe(99.99)

    })

});