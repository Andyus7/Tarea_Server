import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.ts";

const router = Router();
const productsController = new ProductsController();

router.get("/getAll", productsController.getAll);
router.get("/getById/:id", productsController.getById);
router.post("/create", productsController.create);
router.put("/update/:id", productsController.update);
router.delete("/delete/:id", productsController.delete);
router.patch("/change-price/:id", productsController.changePrice);

export default router;

