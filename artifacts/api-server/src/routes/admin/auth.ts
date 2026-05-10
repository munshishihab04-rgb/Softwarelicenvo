import { Router, type IRouter } from "express";
import { generateAdminToken, ADMIN_PASSWORD } from "../../lib/auth";

const router: IRouter = Router();

router.post("/admin/login", (req, res): void => {
  const { password } = req.body as { password?: string };
  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = generateAdminToken();
  res.json({ token });
});

export default router;
