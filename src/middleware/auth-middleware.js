import {prismaClient} from "../application/database.js";

export const authMiddleware = async (req, res, next) => {

    // check header, authorization-token exist or not
    const token = req.get('Authorization');

    if (!token) {
        // throw errors 'unauthorized if token does not exist
        res.status(401).json({
            errors: 'Unauthorized',
        });
    } else {
        // search user if token exist
        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        });

        if (!user) {
            res.status(401).json({
                errors: 'Unauthorized',
            });
        } else {
            req.user = user;
            next();
        }
    }

}