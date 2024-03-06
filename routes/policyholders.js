const router = require("koa-router")();
const policyholderController = require("../controllers/policyholderController");

router.get("/api/policyholders", policyholderController.getPolicyholder);
router.get("/api/policyholders/:code/top", policyholderController.getTopPolicyholders);

module.exports = router;
