class ViewSessionController {
    registro = (req, res) => {
        res.render('register', {})
    }

    login = (req, res) => {
        res.render('login', {})
    }
}

export default ViewSessionController