import {validate} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation
} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import * as bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

const register = async (req) => {

    // check for validation
    const user = validate(registerUserValidation, req);

    // check user exist or not
    const countUser = await prismaClient.user.count({
        where: {
            username: user.username,
        }
    });

    // return error if user already exist
    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    // hash password with bcrypt
    user.password = await bcrypt.hash(user.password, 10);

    // create new user
    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });
}

const login = async (req) => {

    // check for validation
    const loginRequest = validate(loginUserValidation, req);

    // check data exist in database
    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    });

    // throw error if user not exist
    if (!user) {
        throw new ResponseError(401, "Username or Password is wrong");
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    // throw error if auth wrong
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password is wrong");
    }

    // create token for user
    const token = uuid().toString();

    // update field token user
    return prismaClient.user.update({
        where: {
            username: user.username,
        },
        data: {
            token: token
        },
        select: {
            token: true
        }
    });

}

const get = async (username) => {
    // check for validation username
    username = validate(getUserValidation, username);

    // search username in database
    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    });

    // throw error if user does not exist
    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return user;
}

const update = async (req) => {
    // check for validation
    const user = validate(updateUserValidation, req);

    // count user in database
    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username,
        }
    });

    // throw error if user does not found
    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "User is not found");
    }

    const data = {}

    if (user.name) {
        // store in data
        data.name = user.name;
    }
    if (user.password) {
        // store in data
        data.password = await bcrypt.hash(user.password, 10);
    }

    // update user
    return prismaClient.user.update({
        where: {
            username: user.username,
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    });
}

const logout = async (username) => {
    // check for validation username
    username = validate(getUserValidation, username);

    // search username in database
    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    });

    // throw error if user does not exist
    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    // remove data token latest
    return prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}

export default {
    register,
    login,
    get,
    update,
    logout
}