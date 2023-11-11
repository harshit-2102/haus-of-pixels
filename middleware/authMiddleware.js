const admin = require('firebase-admin');

const requireAuth = (req, res, next) => {
    const sessionCookie = req.cookies.session || '';

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((decodedClaims) => {
            if(!decodedClaims){
                res.redirect('/');
            }else{
                next();
            }
        })
        .catch((error) => {
            console.log(error);
            res.redirect('/');
        });
}

const requireAdmin = (req, res, next) => {
    const sessionCookie = req.cookies.session || '';

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((decodedClaims) => {
            if(!decodedClaims){
                res.redirect('/');
            }else if(!res.locals.isAdmin){
                res.redirect('/dashboard');
            }else{
                next();
            }
        })
        .catch((error) => {
            console.log(error);
            res.redirect('/');
        });
}

// check current user
const checkUser = async (req, res, next) => {
    const token = req.cookies.session || " ";
    res.locals.isAdmin = false;
    try {
        const decodedClaims = await admin.auth().verifySessionCookie(token, true);
        res.locals.user = decodedClaims;
        if(res.locals.user.email === "harshit2102rathod@gmail.com"){
            res.locals.isAdmin = true;
        }
        next();
    } catch (error) {
        res.locals.user = null;
        next();
    }

}

module.exports = { requireAuth, checkUser, requireAdmin };
