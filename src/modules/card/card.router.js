import { Router } from "express";
import { isAuthenticated } from "./../../middleware/isAuthenticated.js";
import { isValid } from "./../../middleware/validation.js";
import {
  cardSchema,
  removeCardSchema,
} from "./card.validation.js";
import {
  addToCard,
  updateCard,
  getAllProductOfCards,
  removeProductFromCards,
  clearCard,
} from "./card.controller.js";

const router = Router();
// CRAD
router.post("/", isAuthenticated, isValid(cardSchema), addToCard);

router.get("/", isAuthenticated, getAllProductOfCards);

router.patch("/", isAuthenticated, isValid(cardSchema), updateCard);
router.put("/clear", isAuthenticated, clearCard);

router.patch(
  "/:productId",
  isAuthenticated,
  isValid(removeCardSchema),
  removeProductFromCards
);

export default router;
