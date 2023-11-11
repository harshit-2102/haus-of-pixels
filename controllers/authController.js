const admin = require('firebase-admin');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    if (err.message === 'Incorrect Email') {
        errors.email = 'That email is not registered';
    }

    if (err.message === 'Incorrect Password') {
        errors.password = 'Incorrect Password';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'Entered email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('users validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
            // console.log(properties);
        });
    }

    return errors;
}

module.exports.signup_get = (req, res) => {
    res.render('signup', {
        pageTitle: "Sign Up"
    });
}

module.exports.login_get = (req, res) => {
    res.render('login', {
        pageTitle: "Login"
    });
}

module.exports.signup_post = async (req, res) => {
    try {
        const userResponse = await admin.auth().createUser({
            email: req.body.email,
            password: req.body.password,
        })
        res.json(userResponse);
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {

    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                res.cookie('session', sessionCookie, options);
                res.end(JSON.stringify({ status: 'success' }));
            },
            (err) => {
                const errors = handleErrors(err);
                res.status(400).json({ errors });
            }
        )
        .catch((err) => {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        })
}

module.exports.logout_get = (req, res) => {
    res.clearCookie("session");
    res.redirect('/');
}