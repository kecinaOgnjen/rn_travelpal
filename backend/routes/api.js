const express = require('express');
const router = express.Router();
const config = require('../config/config');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../database");
const {query} = require("express");
const path = require('path');

router.route('/login').post(async function (req, res) {
    var retVal = {idToken: null, msg: '', isSuccess: false, role: null, userId: null};
    try {
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }
        const {email, password} = req.body;


        const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows == null || rows.length == 0) {
            retVal.msg = 'Email is not valid';
            return res.status(200).json(retVal);
        }

        const user_db = rows[0];
        if (password !== user_db.password) {
            retVal.msg = 'Password is not valid';
            return res.status(200).json(retVal);
        }

        const token = jwt.sign({
            id: user_db.id,
            email: email,
            isAdmin: false
        }, config.serverSecretKey, {expiresIn: '365d'});
        retVal.idToken = token;
        retVal.isSuccess = true;
        retVal.role = user_db.role;
        retVal.userId = user_db.id;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/register').post(async function (req, res) {
    var retVal = {msg: '', isSuccess: false};
    try {
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }
        const {name_surname, email, password, role} = req.body;


        const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
        if (rows && rows.length > 0) {
            retVal.msg = 'Email already exists';
            return res.status(200).json(retVal);
        }

        const created_at = moment().unix();
        await pool.query(`INSERT INTO users(
            name_surname, email, password, role, created_at)
            VALUES ($1, $2, $3, $4, $5)`, [name_surname, email, password, role, created_at]);

        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/createOrder').post(expressJwt({secret: config.serverSecretKey}), async function (req, res) {
    var retVal = {msg: '', isSuccess: false};
    try {
        if (req.user == null || req.user === undefined) {
            res.sendStatus(401);
            return;
        }
        if (req.user.id == null || req.user.id === undefined) {
            res.sendStatus(401);
            return;
        }
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }

        const {products, total_price} = req.body;

        if (products && products.length > 0) {
            const created_at = moment().unix();
            const {rows} = await pool.query(`INSERT INTO orders(
                user_id, total_price, created_at)
                VALUES ($1, $2, $3) RETURNING id `, [req.user.id, total_price, created_at]);

            if (rows && rows.length > 0) {

                for (let i = 0; i < products.length; i++) {
                    await pool.query(`INSERT INTO products2order(
                        product_id, order_id)
                        VALUES ($1, $2)`, [products[i], rows[0].id]);
                }

                retVal.isSuccess = true
            } else {
                retVal.msg = 'Problem with inserting order';
            }
        } else {
            retVal.msg = 'Products are empty';
        }

        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/createProduct').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, productId: undefined};
    try {
        /*if (req.user == null || req.user === undefined) {res.sendStatus(401); return;}
        if (req.user.id == null || req.user.id === undefined) {res.sendStatus(401); return;}*/
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }

        const {name, model, description, quantity, categoryid, is_new, is_discount, posId, price} = req.body;
        const created_at = moment().unix();
        console.log("create");

        const {rows} = await pool.query(`INSERT INTO products(
            name, model, description, total_quantity, categoryid, is_new, is_discount, created_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id `, [name, model, description, quantity, categoryid, is_new, is_discount, created_at]);

        if (rows && rows.length > 0) {
            let productId = rows[0].id;

            await pool.query(`INSERT INTO product2points_of_sale(
                price, quantity, product_id, pos_id)
                VALUES ($1, $2, $3, $4)`, [price, quantity, productId, posId]);


            retVal.productId = productId;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Problem with inserting product';
        }

        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getProductsByPosId').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }

        const {posId} = req.body;
        const {rows} = await pool.query(`
            SELECT p.*, pos.name as pointName, pos.address as pointAddress  FROM product2points_of_sale p2p 
            JOIN products p ON p.id = p2p.product_id
            JOIN points_of_sale pos ON pos.id = p2p.pos_id
            WHERE p2p.pos_id = $1`
            , [posId]);
        retVal.products = rows;
        retVal.isSuccess = true;

        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getProductsByCategoryId').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }

        const {categoryid} = req.body;
        const {rows} = await pool.query(`SELECT * FROM products p WHERE categoryid=$1`, [categoryid]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getNewProducts').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM products p WHERE is_new=true`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getPopularProducts').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM product_categories WHERE popularity >= 8`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getProductsOnDiscount').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products as lp, tv_products as tp  WHERE is_discount=true`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/createCategory').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {name, img_url} = req.body;
        const {rows} = await pool.query(`INSERT INTO product_categories(
            name, img_url)
            VALUES ($1, $2) RETURNING id`, [name, img_url]);

        if (rows && rows.length > 0) {
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Problem with creating category. Try again.';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getAllUsers').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM users`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/deleteUser').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {id} = req.body;
        const {rows} = await pool.query(`DELETE  FROM users  WHERE id=$1`, [id]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/editUser').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {id, password} = req.body;
        const {rows} = await pool.query(`UPDATE users SET password=$2 WHERE id = $1;`, [id, password]);
        if (rows && rows.length > 0) {
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Success';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

/*TV Categories*/
router.route('/getTVCategories').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_categories`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getAllTV').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_products`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getFOXTV').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_products WHERE fk_category = 1`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getHisenseTV').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_products WHERE fk_category = 2`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getLgTV').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_products WHERE fk_category = 3`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getPanasonicTV').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_products WHERE fk_category = 4`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getSamsungTV').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_products WHERE fk_category = 5`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getTeslaTV').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_products WHERE fk_category = 6`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getTvById').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }

        const {tvId} = req.body;
        const {rows} = await pool.query(`SELECT * FROM tv_products p WHERE id=$1`, [tvId]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/geTVOnDiscount').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_products  WHERE is_discount=true`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getTVNew').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM tv_products  WHERE is_new=true`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, moment().unix() + '_' + file.originalname);
    }
});

var upload = multer({storage: storage});

router.route('/uploadImage').post(upload.array("files"), async function (req, res) {
    let retVal = { msg: '', img: ''};

    try
    {
        let files = req.files;
        console.log({files})
        if(files && files.length > 0 ){
            retVal.img = 'http://localhost:5000/uploads/' + files[0].filename;
        }else {
            retVal.msg = 'Error';
        }

        res.status(200).json(retVal);

    }catch(err){
        console.log({err});
        res.status(500);
    }
});

router.route('/createTV').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {
            name,
            is_discount,
            is_new,
            is_smart,
            video,
            audio,
            display,
            price,
            price_discount,
            fk_category,
            img,
            fk_pos_id
        } = req.body;

        const {rows} = await pool.query(`INSERT INTO tv_products(
            name, is_discount, is_new,is_smart, video, audio, display, price, price_discount,fk_category, img, fk_pos_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`, [name, is_discount, is_new, is_smart, video, audio, display, price, price_discount, fk_category, img, fk_pos_id]);

        let tvID = 0;
        for (let i = 0; i < rows.length; i++) {
            tvID = rows[i].id
        }
        let lapTopID = null;

        const {rows4} = await pool.query(`INSERT INTO categories(tv_categories)
            VALUES ($1) RETURNING id`, [ fk_category]);

        const {rows2} = await pool.query(`INSERT INTO products(
            tv_products, laptop_products)
            VALUES ($1, $2) RETURNING id`, [tvID, lapTopID]);

        let quantity = 5;
        const {rows3} = await pool.query(`INSERT INTO product2points_of_sale(
            product_id, pos_id, quantity)
            VALUES ($1, $2, $3) RETURNING id`, [tvID, fk_pos_id, quantity]);

        if (rows && rows.length > 0) {
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Problem with creating tv. Try again.';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/deleteTV').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {id} = req.body;

        const {rows3} = await pool.query(`DELETE  FROM product2points_of_sale  WHERE product_id=$1`, [id]);
        const {rows2} = await pool.query(`DELETE  FROM products  WHERE tv_products=$1`, [id]);
        const {rows} = await pool.query(`DELETE  FROM tv_products  WHERE id=$1`, [id]);


        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/createLaptop').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {
            is_discount,
            is_new,
            ssd,
            memory,
            core,
            display,
            img,
            price,
            price_discount,
            fk_category,
            name,
            fk_pos_id
        } = req.body;
        const {rows} = await pool.query(`INSERT INTO laptop_products(
            is_discount, is_new, ssd, memory, core, display, img, price, price_discount, fk_category, name, fk_pos_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`, [is_discount, is_new, ssd, memory, core, display, img, price, price_discount, fk_category, name, fk_pos_id]);

        const {rows4} = await pool.query(`INSERT INTO categories(laptop_categories)
            VALUES ($1) RETURNING id`, [ fk_category]);


        let lapTopID = 0;
        for (let i = 0; i < rows.length; i++) {
            lapTopID = rows[i].id
        }

        let tvId = null;
        const {rows2} = await pool.query(`INSERT INTO products(
            tv_products, laptop_products)
            VALUES ($1, $2) RETURNING id`, [tvId, lapTopID]);

        let quantity = 5;

        const {rows3} = await pool.query(`INSERT INTO product2points_of_sale(
            product_id, pos_id, quantity)
            VALUES ($1, $2, $3) RETURNING id`, [lapTopID, fk_pos_id, quantity]);

        if (rows && rows.length > 0) {
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Problem with creating laptop. Try again.';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/deleteLaptop').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {id} = req.body;
        const {rows3} = await pool.query(`DELETE  FROM product2points_of_sale  WHERE product_id=$1`, [id]);
        const {rows2} = await pool.query(`DELETE  FROM products  WHERE laptop_products=$1`, [id]);
        const {rows} = await pool.query(`DELETE  FROM laptop_products  WHERE id=$1`, [id]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/editTV').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {
            id,
            is_discount,
            is_new,
            is_smart,
            video,
            audio,
            display,
            img,
            price,
            price_discount,
            fk_category,
            name,
            fk_pos_id
        } = req.body;
        const {rows} = await pool.query(`UPDATE tv_products SET is_discount= $2, is_new=$3, is_smart=$4, video=$5, audio=$6, display=$7, img=$8, price=$9, price_discount=$10, fk_category=$11, name=$12, fk_pos_id=$13 WHERE id = $1;`, [id, is_discount, is_new, is_smart, video, audio, display, img, price, price_discount, fk_category, name, fk_pos_id]);
        if (rows && rows.length > 0) {
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Success';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/editLaptop').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {
            id,
            is_discount,
            is_new,
            ssd,
            memory,
            core,
            display,
            img,
            price,
            price_discount,
            fk_category,
            name,
            fk_pos_id
        } = req.body;
        const {rows} = await pool.query(`UPDATE laptop_products SET is_discount= $2, is_new=$3, ssd=$4, memory=$5, core=$6, display=$7, img=$8, price=$9, price_discount=$10, fk_category=$11, name=$12, fk_pos_id=$13 WHERE id = $1;`, [id, is_discount, is_new, ssd, memory, core, display, img, price, price_discount, fk_category, name, fk_pos_id]);

        if (rows && rows.length > 0) {
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Success';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

/*LapTop Categories*/
router.route('/getAllLaptops').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getAcerLapTop').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products WHERE fk_category = 1`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getAsusLapTop').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products WHERE fk_category = 2`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getDellLapTop').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products WHERE fk_category = 3`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getFujitsuLapTop').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products WHERE fk_category = 4`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getHpLapTop').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products WHERE fk_category = 5`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getLenovoLapTop').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products WHERE fk_category = 6`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getLaptopById').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }

        const {laptopId} = req.body;
        const {rows} = await pool.query(`SELECT * FROM laptop_products WHERE id=$1`, [laptopId]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});


router.route('/getLaptopsOnDiscount').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products  WHERE is_discount=true`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getLaptopsNew').get(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {rows} = await pool.query(`SELECT * FROM laptop_products  WHERE is_new=true`, []);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});


router.route('/editLaptop').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {
            id,
            is_discount,
            is_new,
            ssd,
            memory,
            core,
            display,
            img,
            price,
            price_discount,
            fk_category,
            name,
            fk_pos_id
        } = req.body;
        const {rows} = await pool.query(`UPDATE laptop_products SET is_discount= $2, is_new=$3, ssd=$4, memory=$5, core=$6, display=$7, img=$8, price=$9, price_discount=$10, fk_category=$11, name=$12, fk_pos_id=$13 WHERE id = $1;`, [id, is_discount, is_new, ssd, memory, core, display, img, price, price_discount, fk_category, name, fk_pos_id]);
        console.log(rows)
        if (rows && rows.length > 0) {
            console.log(rows)
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Problem with creating laptop. Try again.';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/createLaptop').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {
            is_discount,
            is_new,
            ssd,
            memory,
            core,
            display,
            img,
            price,
            price_discount,
            fk_category,
            name,
            fk_pos_id
        } = req.body;
        const {rows} = await pool.query(`INSERT INTO laptop_products(
            is_discount, is_new, ssd, memory, core, display, img, price, price_discount, fk_category, name, fk_pos_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`, [is_discount, is_new, ssd, memory, core, display, img, price, price_discount, fk_category, name, fk_pos_id]);

        if (rows && rows.length > 0) {
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Problem with creating laptop. Try again.';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/addLaptopToCart').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false};
    try {
        const {product_id, product_name, product_price, user_id, product_image, pos_id} = req.body;
        const {rows} = await pool.query(`INSERT INTO cart(
            product_id, product_name, product_price, user_id, product_image, pos_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING product_id`, [product_id, product_name, product_price, user_id, product_image, pos_id]);

        if (rows && rows.length > 0) {
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Problem with adding an laptop to cart. Try again.';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getProductsOfCartForUser').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {user_id} = req.body;
        const {rows} = await pool.query(`SELECT * FROM cart WHERE user_id=$1`, [user_id]);


        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getPointsOfSale').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {user_id} = req.body;
        const {rows} = await pool.query(`SELECT id, name FROM points_of_sale`);


        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getProductsFromPointsOfSaleTv').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {pos_id} = req.body;
        const {rows} = await pool.query(`SELECT id, name, price, price_discount,img FROM tv_products WHERE fk_pos_id = $1`, [pos_id]);


        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getProductsFromPointsOfSaleLaptop').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {pos_id} = req.body;
        const {rows} = await pool.query(`SELECT id, name, price, price_discount,img FROM laptop_products WHERE fk_pos_id = $1`, [pos_id]);


        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});


router.route('/addTvToCart').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false};
    try {
        const {product_id, product_name, product_price, user_id, product_image, pos_id} = req.body;
        const {rows} = await pool.query(`INSERT INTO cart(
            product_id, product_name, product_price, user_id, product_image, pos_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING product_id`, [product_id, product_name, product_price, user_id, product_image, pos_id]);

        if (rows && rows.length > 0) {
            retVal.categoryId = rows[0].id;
            retVal.isSuccess = true;
        } else {
            retVal.msg = 'Problem with adding an laptop to cart. Try again.';
        }
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getProductPointsOfSale').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {fk_pos_id} = req.body;
        // const { rows } = await pool.query(`SELECT * FROM laptop_products lp, points_of_sale pos WHERE  pos.id = $1`, [fk_pos_id]);

        const {rows} = await pool.query(`select pos.name, pos.address from laptop_products AS lp INNER JOIN points_of_sale AS pos ON pos.id = $1`, [fk_pos_id]);


        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getProductPointsOfSaleTv').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {fk_pos_id} = req.body;
        // const { rows } = await pool.query(`SELECT * FROM laptop_products lp, points_of_sale pos WHERE  pos.id = $1`, [fk_pos_id]);

        const {rows} = await pool.query(`select pos.name, pos.address from tv_products AS lp INNER JOIN points_of_sale AS pos ON pos.id = $1`, [fk_pos_id]);


        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getUsers').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {id} = req.body;
        const {rows} = await pool.query(`SELECT * FROM users`);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getUsersOrder').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {id} = req.body;
        const {rows} = await pool.query(`SELECT * FROM cart WHERE user_id = $1`, [id]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/getProductsFromCartOfUserId').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, products: []};
    try {
        const {id} = req.body;

        const {rows} = await pool.query(`SELECT product_name, product_price, product_image, pos_id FROM cart WHERE user_id = $1`, [id]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});


router.route('/deleteLaptopFromCart').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {id} = req.body;
        const {rows} = await pool.query(`DELETE  FROM cart  WHERE product_id=$1`, [id]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/order').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {product_id} = req.body;
        const {rows} = await pool.query(`UPDATE product2points_of_sale SET quantity= (quantity-1) WHERE product_id=$1`, [product_id]);
        const {rows2} = await pool.query(`DELETE  FROM cart  WHERE product_id=$1`, [product_id]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/showQuantity').post(/*expressJwt({ secret: config.serverSecretKey }),*/ async function (req, res) {
    var retVal = {msg: '', isSuccess: false, categoryId: undefined};
    try {
        const {product_id} = req.body;
        const {rows} = await pool.query(`SELECT quantity FROM product2points_of_sale WHERE product_id = $1`, [product_id]);

        retVal.products = rows;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});
module.exports = router;
