import express from "express";
import { User } from "../Models/User";
import { body, validationResult } from "express-validator";
const router = express.Router();

const user = User;
router.post(
  "/createuser",
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      user.create({
        name: "Shyam",
        password: "123456",
        email: "shyamdas123@hotmail.com",
        location: "Qwerty",
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

module.exports = router;
