import { Router } from "express";
import { registerUser } from "../controllers";
import { genericValidator } from "../middlewares/request-checker";
import * as Dto from "../utils/validator-checker";
const router = Router();

router.route('/register')
    .post(genericValidator(Dto.registerUser), registerUser);

router.route('/test')
    .get((req, res) => {
        res.json({
            data: "this is for testing 😛"
        });
    });

export { router as mainRouter };