exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie')
        .split(';')[1] //dipende da quanti cookie inviamo, bisogna selezionare quello giusto
        .trim()
        .split('=')[1] == 'true';
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly'); //'HttpOnly' protegge da tentativi di XSS; 'Secure' permette di utilizzare il cookie solo con Https
    res.redirect('/');
};