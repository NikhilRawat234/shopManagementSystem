import express from "express";

import admin from './api/v1/controller/admin/router';
import vendor from './api/v1/controller/vendor/router'
import shop from "./api/v1/controller/shop/router"
import category from "./api/v1/controller/category/router";
import product from "./api/v1/controller/product/router";
import user from "./api/v1/controller/user/router"

const router = express.Router();


router.use('/api/v1/admin', admin);

router.use('/api/v1/vendor', vendor)

router.use('/api/v1/shop', shop);

router.use('/api/v1/category', category)

router.use('/api/v1/product', product);

router.use('/api/v1/user', user)

export default router;
