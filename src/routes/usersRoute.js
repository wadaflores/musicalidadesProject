const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

/************************** MIDDLEWARES *********************/

const authMiddleware = require('../middlewares/authMiddleware.js');
const guestMiddleware = require('../middlewares/guestMiddleware.js');
const verificarUsuarioMiddleware = require("../middlewares/verificarUsuarioMiddleware")

const validacionRegistroBack = require("../middlewares/validacionRegistroBack.js")
const validacionLoginBack = require("../middlewares/validacionLoginBack.js")
const validacionModificarUsuario = require("../middlewares/validacionModificarUsuarioBack")
const validacionCambiarPassword = require("../middlewares/validacionCambiarPasswordBack")
const validacionResetPassword = require("../middlewares/validacionResetPasswordBack")

/************************** MULTER **************************/

const storage = multer.diskStorage ({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/img/users'));
    },
    filename: (req, file, cb) => {
        const nameImgUser = 'user-' + Date.now() + path.extname(file.originalname);
        cb(null, nameImgUser);
    }
});

const upload = multer({storage});

const fileFilter = (req, file, cb) => {
    if ((file.mimetype).includes("jpeg") || (file.mimetype).includes("png") || (file.mimetype).includes("jpg")) {
        console.log(file)
        cb(null, true);
    }
    else {
        console.log(file)
        cb(null, false)
        req.errorMulter = "Subiste imagenes con formato incorrecto";
    }
}


const uploadFile = multer({
    fileFilter: fileFilter,
    storage: storage
})
/* CON ARCHIVO CONTROLLER*/

const usersController = require ('../controllers/usersController.js');

router.get('/register', guestMiddleware, usersController.registerGet);
router.post('/register', uploadFile.single('avatar'), validacionRegistroBack, usersController.registerPost);

router.get('/login', guestMiddleware, usersController.loginGet);
router.post('/login', validacionLoginBack, usersController.loginPost); 

router.get("/signout", usersController.signOut) 
router.get("/myprofile", authMiddleware, usersController.profile)

router.get("/cambiarPassword", authMiddleware, usersController.cambiarPasswordGet)
router.patch("/cambiarPassword/:id", authMiddleware, verificarUsuarioMiddleware, validacionCambiarPassword, usersController.cambiarPasswordPost)

router.get("/modifyuser/:id", usersController.modifyUser);
router.patch("/myprofile/:id", authMiddleware, verificarUsuarioMiddleware, uploadFile.single('avatar'), validacionModificarUsuario, usersController.profileEdition)

router.get("/deleteuser/:id", usersController.borrar)


router.get("/resetPassword", guestMiddleware, usersController.resetPasswordGet)
router.get("/restablecerPassword/:token", usersController.generateNewPasswordGet)
router.post("/resetPassword", guestMiddleware, validacionResetPassword, usersController.resetPasswordPost)


module.exports = router;