import factory from "../factory";

const router = factory.createApp();

router.get("/", (c) => c.text("ok"));

export default router;
