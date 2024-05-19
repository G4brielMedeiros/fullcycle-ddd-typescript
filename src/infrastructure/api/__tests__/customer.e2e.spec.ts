import request from "supertest"
import { app, sequelize } from "../express"

describe("E2E test for customer", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    })

    afterAll(async () => {
        await sequelize.close();
    })

    it("should create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "street",
                    city: "city",
                    number: 324,
                    zip: "12345"
                },
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("John")
        expect(response.body.address).toEqual({
            street: "street",
            city: "city",
            number: 324,
            zip: "12345"
        })
    })

    it("should not create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John"
            });

        expect(response.status).toBe(500);
    })

    it("should list all customers", async () => {

        const response1 = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "street",
                    city: "city",
                    number: 324,
                    zip: "12345"
                },
            });
        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "Jane",
                address: {
                    street: "street 2",
                    city: "city",
                    number: 324,
                    zip: "12345"
                },
            });
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/customer").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);
        const customer = listResponse.body.customers[0];
        expect(customer.name).toBe("John")
        expect(customer.address.street).toBe("street")
        const customer2 = listResponse.body.customers[1];
        expect(customer2.name).toBe("Jane")
        expect(customer2.address.street).toBe("street 2")

    })

});