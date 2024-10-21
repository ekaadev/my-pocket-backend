import {
    createManyTestContacts,
    createTestContact,
    createTestUser, getTestContact,
    removeAllTestContacts,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";

describe('POST /api/contact', () => {

    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can create new contact', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: 'test',
                last_name: 'test',
                email: 'test@test.com',
                phone: '02102021',
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe('test');
        expect(result.body.data.last_name).toBe('test');
        expect(result.body.data.email).toBe('test@test.com');
        expect(result.body.data.phone).toBe('02102021');
    });

    it('should reject request is not valid', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: 'test',
                email: 'test',
                phone: '02102021sdasdasdasdasda',
            });

        logger.info(result.body.errors);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach( async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can get contact by id', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id)
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe(testContact.first_name);
        expect(result.body.data.last_name).toBe(testContact.last_name);
        expect(result.body.data.email).toBe(testContact.email);
        expect(result.body.data.phone).toBe(testContact.phone);
    });

    it('should reject id invalid', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1)
            .set('Authorization', 'test');

        logger.info(result.body.errors);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach( async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can update contact', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization', 'test')
            .send({
                first_name: 'tests',
                last_name: 'tests',
                email: 'test@tests.com',
                phone: '02102022',
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe("tests");
        expect(result.body.data.last_name).toBe("tests");
        expect(result.body.data.email).toBe("test@tests.com");
        expect(result.body.data.phone).toBe("02102022");
    });

    it('should reject id wrong', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + 1)
            .set('Authorization', 'test')
            .send({
                first_name: 'tests',
                last_name: 'tests',
                email: 'test@tests.com',
                phone: '02102022',
            });

        logger.info(result.body.errors);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject parameter invalid', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: '',
                email: 'test.com',
                phone: '',
            });

        logger.info(result.body.errors);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

});

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    })

    afterEach( async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can delete contact', async() => {
        let testContact = await getTestContact();
        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id)
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200)
        expect(result.body.data).toBe('OK');

        testContact = await getTestContact();

        expect(testContact).toBeNull();

    });


    it('should reject id contact not founf', async() => {
        let testContact = await getTestContact();
        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + 1)
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(404)
        expect(result.body.errors).toBeDefined()
    });

})


describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestContacts();
    })

    afterEach( async () => {
        await removeAllTestContacts();
        await removeTestUser();
    })

    it('should can get many contacts', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(15);
    });

    it('should can search using name', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
              name: "test1"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
    });

    it('should can search using email', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                email: "test1"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
    });

    it('should can search using phone', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                phone: "02102021"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(15);
    });
});