import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { activateAccount, register,logIn, sendForgetCode, resetPassword} from "./user.contorller.js";
import { activateSchema, loginSchema, regiserSchema , forgetPassSchema ,resetPasswordSchema} from "./user.validation.js";

const router = Router();
// Register
router.post("/register",isValid(regiserSchema) , register);
//login
router.post("/login",isValid(loginSchema),logIn)

// Activate Account 
router.get("/confirmEmail/:activationCode",isValid(activateSchema),activateAccount)
// forget pass
router.patch('/forgetPass',isValid(forgetPassSchema),sendForgetCode)
// reset password 
router.patch("/resetPassword",isValid(resetPasswordSchema),resetPassword)
export default router;
