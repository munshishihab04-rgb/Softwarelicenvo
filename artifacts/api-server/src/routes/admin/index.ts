import { Router, type IRouter } from "express";
import authRouter from "./auth";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import settingsRouter from "./settings";
import keysRouter from "./keys";

const router: IRouter = Router();

router.use(authRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(ordersRouter);
router.use(settingsRouter);
router.use(keysRouter);

export default router;
