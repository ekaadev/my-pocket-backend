import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";
import {createTestUser, getTestUser, removeTestUser} from "./test-util.js";
import bcrypt from "bcrypt";

describe("POST api/users", () => {

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can register new user',  async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'Test'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('Test');
        expect(result.body.data.password).toBeUndefined();
    });

    it('should failed register new user',  async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
            });

        logger.info(result.body.errors);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should fail register new user, user already exist',  async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'Test'
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('Test');
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'Test'
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })
})

describe("POST api/users/login", () => {
    beforeEach(async () => {
        await createTestUser()
    });

    afterEach( async () => {
        await removeTestUser()
    });

    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'rahasia'
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe("test");
    });

    it('should fail if user or pass empty', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: '',
                password: ''
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should fail if pass wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'sad'
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should fail if user not exist', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'tests',
                password: 'sad'
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

});

describe("GET api/users/current", () => {
    beforeEach(async () => {
        await createTestUser()
    });

    afterEach( async () => {
        await removeTestUser()
    });

    it('should can get user', async () => {

        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('Test');

    });

    it('should fail, authorization wrong', async () => {

        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'salah');

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined()

    });

    it('should fail, authorization not exist', async () => {

        const result = await supertest(web)
            .get('/api/users/current')

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined()

    });
});

describe("PATCH api/users/current", () => {

    beforeEach(async () => {
        await createTestUser()
    });

    afterEach( async () => {
        await removeTestUser()
    });


    it('should can update user', async() => {

        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: 'Tests',
                password: 'rahasialagi'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('Tests');

        const user = await getTestUser();

        logger.info(user);

        expect(await bcrypt.compare("rahasialagi", user.password)).toBe(true);
    });

    it('should can update name', async() => {

        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: 'Tests',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('Tests');
    });

    it('should can update password', async() => {

        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                password: 'rahasialagi'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('Test');

        const user = await getTestUser();

        logger.info(user);

        expect(await bcrypt.compare("rahasialagi", user.password)).toBe(true);
    });


    it('should fail update, authorization wrong', async() => {

        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'salah')
            .send({
                name: 'Tests',
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE api/users/logout', () => {

    beforeEach(async () => {
        await createTestUser()
    });

    afterEach( async () => {
        await removeTestUser()
    });


    it('should can logout', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'test')

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('OK');

        const user = await getTestUser();

        expect(user.token).toBeNull();
    });

    it('should fail logout token invalid', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'salah')

        expect(result.status).toBe(401);
    });


});