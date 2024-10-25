import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

/* Example usesage: 
router.post('/user', 
  [
    check('username').isLength({ min: 5 }),
    check('email').isEmail(),
  ],
  validateRequest,
  userController.createUser
);
*/


// Middleware for validation error handling
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validateRequest;
