import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
        // create user send to user-service
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        // login user send to user-service
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        // get user current send to user service
        const username = req.user.username;
        const result = await userService.get(username);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        // receive data username from auth middleware
        const username = req.user.username;
        // assign req body to request
        const request = req.body;
        // assign username to request
        request.username = username;

        // update user current send to user service
        const result = await userService.update(request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e)
    }
}

const logout = async (req, res, next) => {
    try {
        // receive data from auth middleware and assign to parameter user service logout
        await userService.logout(req.user.username);
        res.status(200).json({
            data: "OK",
        })
    } catch (e) {
        next(e)
    }
}

export default {
    register,
    login,
    get,
    update,
    logout
}