const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const controller = require('../controllers/dashboardController');
router.get('/', auth, admin, controller.summary);
router.get('/report.csv', auth, admin, controller.reportCsv);
module.exports = router;
