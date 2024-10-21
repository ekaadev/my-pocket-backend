import contactService from "../service/contact-service.js";
import userService from "../service/user-service.js";
import {logger} from "../application/logging.js";

const create = async (req, res, next) => {
    try {
        // receive data from auth middleware
        const user = req.user;
        // receive data from request body
        const request = req.body
        // assign both (user & request) to parameter contact-service create
        const result = await contactService.create(user, request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        // receive data from auth middleware
        const user = req.user;
        const contactId = req.params.contactId;
        // get contact send parameter to contact service
        const result = await contactService.get(user, contactId);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {

    try {
        // receive data from auth middleware
        const user = req.user;
        // receive data from params contactId
        const contactId = req.params.contactId;
        // assign id, req body to request
        const request = req.body;
        request.id = contactId;
        // update, send parameter to contact service
        const result = await contactService.update(user, request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        // receive data from auth middleware
        const user = req.user;
        // receive data from req param
        const contactId = req.params.contactId;
        // send both to parameter contact service remove
        const result = await contactService.remove(user, contactId);
        res.status(200).json({
            data: "OK"
        })
    } catch (e) {
        next(e);
    }
}

const search = async (req, res, next) => {
    try {
        // receive data from auth middleware
        const user = req.user;
        // receive data from query param
        const request = {
            name: req.query.name,
            email: req.query.email,
            phone: req.query.phone
        }
        // search data
        const result = await contactService.search(user, request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}