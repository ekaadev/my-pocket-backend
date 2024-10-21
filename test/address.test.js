import {
    createTestAddress,
    createTestContact,
    createTestUser, getTestAddress, getTestContact,
    removeAllTestAddresses,
    removeAllTestContacts,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";

describe('POST /api/contacts/:contactId/address', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach( async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can create new address', async () => {

        const testContact = await getTestContact();


        const result = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'test')
            .send({
                street: 'jalan test',
                city: 'city test',
                province: 'province test',
                country: 'country test',
                postal_code: '123',
            });


            expect(result.status).toBe(200);
            expect(result.body.data.id).toBeDefined();
            expect(result.body.data.street).toBe('jalan test');
            expect(result.body.data.city).toBe('city test');
            expect(result.body.data.province).toBe('province test');
            expect(result.body.data.country).toBe('country test');
            expect(result.body.data.postal_code).toBe('123');

    });


    it('should reject request invalid', async () => {

        const testContact = await getTestContact();


        const result = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'test')
            .send({
                street: '',
                city: '',
                province: '',
                country: '',
                postal_code: '',
            });


        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();

    });


    it('should reject contact is not found', async () => {

        const testContact = await getTestContact();


        const result = await supertest(web)
            .post('/api/contacts/' + (testContact.id + 1) + '/addresses')
            .set('Authorization', 'test')
            .send({
                street: 'jalan test',
                city: 'city test',
                province: 'province test',
                country: 'country test',
                postal_code: '123',
            });


        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    })

    afterEach( async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can get contact', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('jalan test');
        expect(result.body.data.city).toBe('city test');
        expect(result.body.data.province).toBe('province test');
        expect(result.body.data.country).toBe('country test');
        expect(result.body.data.postal_code).toBe('123');
    });


    it('should fail contact not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

    it('should fail address not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

});

describe('PUT /api/contacts/:contactId/addresses/addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    })

    afterEach( async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can update address', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/'+ testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')
            .send({
                street: 'jalan',
                city: 'city',
                province: 'province',
                country: 'country',
                postal_code: '111',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testAddress.id);
        expect(result.body.data.street).toBe('jalan');
        expect(result.body.data.city).toBe('city');
        expect(result.body.data.province).toBe('province');
        expect(result.body.data.country).toBe('country');
        expect(result.body.data.postal_code).toBe('111');
    });


    it('should fail request invalid', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/'+ testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')
            .send({
                street: 'jalan',
                city: 'city',
                province: 'province',
                country: '',
                postal_code: '',
            });

        expect(result.status).toBe(400);
    });

    it('should fail address is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/'+ testContact.id + '/addresses/' + testAddress.id + 1)
            .set('Authorization', 'test')
            .send({
                street: 'jalan',
                city: 'city',
                province: 'province',
                country: 'sad',
                postal_code: 'asd',
            });

        expect(result.status).toBe(404);
    });


    it('should fail contact is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/'+ testContact.id + 1 + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')
            .send({
                street: 'jalan',
                city: 'city',
                province: 'province',
                country: 'sad',
                postal_code: 'asd',
            });

        expect(result.status).toBe(404);
    });

})

describe('DELETE /api/contact/contactsId/address/addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    })

    afterEach( async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    })


    it('should can remove address',  async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        testAddress = await getTestAddress();

        expect(testAddress).toBeNull();
    });

    it('should fail address not found',  async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id + 1)
            .set('Authorization', 'test')

        expect(result.status).toBe(404);

    });

    it('should fail contact not found',  async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + 1 + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')

        expect(result.status).toBe(404);

    });

});

describe('GET /api/contacts/:contactId/addresses', () => {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    })

    afterEach( async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can list address', async () => {

        const testContact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'test')

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });

    it('should fail contact not found', async () => {

        const testContact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1 + '/addresses')
            .set('Authorization', 'test')

        expect(result.status).toBe(404);
    });

    it('should fail user wrong', async () => {

        const testContact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1 + '/addresses')
            .set('Authorization', 'testa')

        expect(result.status).toBe(401);
    });
})