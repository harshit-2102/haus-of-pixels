const { Router } = require('express');
const blogController = require('../controllers/blogController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB file size limit
    },
});


const router = Router();

router.get('/dashboard', requireAuth, blogController.get_dashboard);
router.post('/upload', upload.single('photo'), blogController.post_upload);
router.post('/upload-multiple', upload.array('images', 1000), blogController.post_uploadMultiple);
router.get('/profile', requireAuth, blogController.get_profile);
router.get('/photo-details', requireAuth, blogController.get_postData);

//Admin Routes

router.get('/admin/dashboard', requireAdmin, blogController.get_adminDashboard);
router.get('/admin/dashboard/photos',requireAdmin, blogController.get_adminPhotos);
router.get('/admin/dashboard/hashtags',requireAdmin, blogController.get_adminHashtags);


// router.get('/login', authController.login_get);
// router.post('/login', authController.login_post);
// router.get('/logout', authController.logout_get); 

module.exports = router;