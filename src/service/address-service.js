import {validate} from "../validation/validation.js";
import {getContactValidation} from "../validation/contact-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import {
    createAddressValidation,
    getAddressValidation,
    updateAddressValidation
} from "../validation/address-validation.js";

const checkContactMustExist = async (user, contactId) => {
    // check validation contact id
    contactId = validate(getContactValidation, contactId);

    // find contact in database
    const totalContactInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId,
        }
    });

    // throw error if contact id does not exist
    if (totalContactInDatabase !== 1) {
        throw new ResponseError(404, "Contact not found");
    }

    return contactId;
}

const create = async (user, contactId, req) => {

    contactId = await checkContactMustExist(user, contactId);

    // check validation request body
    const address = validate(createAddressValidation, req);
    // assign contact id to address
    address.contact_id = contactId;

    // create data address
    return prismaClient.address.create({
        data: address,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })
}


const get = async (user, contactId, addressId) => {
    // check contactId
    contactId = await checkContactMustExist(user, contactId);
    // check addressId
    addressId = validate(getAddressValidation, addressId);
    // find address by addressId
    const address = await prismaClient.address.findFirst({
        where: {
            contact_id: contactId,
            id: addressId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });

    // throw error if address does not exist
    if (!address) {
        throw new ResponseError(404, "Address not found");
    }

    return address;
}

const update = async (user, contactId, req) => {
    // check contactId
    contactId = await checkContactMustExist(user, contactId);
    // check address
    const address = validate(updateAddressValidation, req);
    const totalAddressInDatabase = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: address.id
        }
    });

    // throw error if address is not found
    if (totalAddressInDatabase !== 1) {
        throw new ResponseError(404, "Address not found");
    }

    return prismaClient.address.update({
        where: {
            id: address.id,
        },
        data: {
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
            postal_code: address.postal_code,
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })
}

const remove = async (user, contactId, addressId) => {
    contactId = await checkContactMustExist(user, contactId);
    addressId = validate(getAddressValidation, addressId);

    const totalAddressInDatabase = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: addressId
        }
    });

    if (totalAddressInDatabase !== 1) {
        throw new ResponseError(404, "Address not found");
    }

    return prismaClient.address.delete({
        where: {
            id: addressId,
        }
    });
}

const list = async (user, contactId) => {
    contactId = await checkContactMustExist(user, contactId);

    return prismaClient.address.findMany({
        where: {
            contact_id: contactId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })
}

export default {
    create,
    get,
    update,
    remove,
    list
}