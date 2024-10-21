import {validate} from "../validation/validation.js";
import {
    createContactValidation,
    getContactValidation,
    searchContactValidation,
    updateContactValidation
} from "../validation/contact-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import {logger} from "../application/logging.js";

const create = async (user, req) => {
    // check for validation
    const contact = validate(createContactValidation, req)
    // assign data username from auth middleware to contact username
    contact.username = user.username
    // create contact
    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        }
    });
}


const get = async (user, contactId) => {
    // check validation contactId
    contactId = validate(getContactValidation, contactId);
    // search contact in database
    const contact = await prismaClient.contact.findFirst({
        where: {
            username: user.username,
            id: contactId,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        }
    });

    // throw error if contact does not exist
    if (!contact) {
        throw new ResponseError(404, "Contact not found");
    }

    return contact;
}

const update = async (user, req) => {
    // check for validation
    const contact = validate(updateContactValidation, req)
    // find in database
    const totalContactInDatabase = await prismaClient.contact.count({
       where: {
           username: user.username,
           id: contact.id
       }
    });
    // throw error is not equal 1
    if (totalContactInDatabase !== 1) {
        throw new ResponseError(404, "Contact not found");
    }
    // update contact if contact exist
    return prismaClient.contact.update({
        where: {
            id: contact.id,
        },
        data: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        }
    })
}

const remove = async (user, contactId) => {
    // check validation
    contactId = validate(getContactValidation, contactId);
    // find in database
    const totalInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId,
        }
    })
    // throw error if contact not found
    if (totalInDatabase !== 1) {
        throw new ResponseError(404, "Contact not found");
    }
    // remove contact
    return prismaClient.contact.delete({
        where: {
            id: contactId,
        }
    })
}

const search = async (user, req) => {
    // check validation
    req = validate(searchContactValidation ,req);

    // filter parameter
    const filters = [];
    filters.push(
        {
            username: user.username,
        }
    )
    if (req.name) {
        filters.push(
            {
                OR: [
                    {
                        first_name: {
                            contains: req.name,
                        }
                    },
                    {
                        last_name: {
                            contains: req.name,
                        }
                    }
                ]
            }
        )
    }
    if (req.email) {
        filters.push(
            {
                email: {
                    contains: req.email,
                }
            }
        )
    }
    if (req.phone) {
        filters.push(
            {
                phone: {
                    contains: req.phone,
                }
            }
        )
    }


    // filters used for find many contact
    return prismaClient.contact.findMany({
        where: {
            AND: filters
        }
    })
}

export default {
    create,
    get,
    update,
    remove,
    search
}