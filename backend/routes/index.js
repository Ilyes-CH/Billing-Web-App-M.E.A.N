const express = require('express');
const router = express.Router();

// Import other route files
const usersRouter = require('./usersRoutes');
// const signUpRouter = require('./signupRoutes')
const invoiceRouter = require('./invoiceRoutes')
const noticeRouter = require('./noticeRoutes')
const orderRouter = require('./ordersRoutes')
const serviceRouter = require('./servicesRoutes')
// const loginRouter = require('./loginRoute')
const checkAdminRouter = require('./checkAdminRoute')
const otpRouter = require('./otpRoutes')
const gainRouter = require('./gainsRoutes')
const newsRouter = require('./newsRoute')
const resetPasswordRouter = require('./resetPasswordRoutes')
const getStorageRouter = require('./getStorage')
const reportsRouter = require('./reportsRoutes')
const feedbackRouter = require('./feedBackRoutes')
const predictionsRouter = require('./predictionRoutes')
// Use the imported routes
router.use('/users', usersRouter);
router.use('/invoices', invoiceRouter)
router.use('/notices', noticeRouter)
router.use('/services', serviceRouter)
router.use('/orders', orderRouter)
router.use('/checkAdmin', checkAdminRouter)
router.use('/auth',otpRouter)
router.use('/gains',gainRouter)
router.use('/news',newsRouter)
router.use('/reset',resetPasswordRouter)
router.use('/df',getStorageRouter)
router.use('/feedback',feedbackRouter)
router.use('/reports',reportsRouter)
router.use('/predictions',predictionsRouter)




module.exports = router;
