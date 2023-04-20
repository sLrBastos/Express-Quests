
const database = require("./database");

const getUsers = (req, res) => {

    let query = " SELECT id, firstname, lastname, email, city, language FROM users"
    const queryUserValues = []

    if (req.query.language != null) {
        query += ` WHERE language LIKE '%${req.query.language}%'`
        queryUserValues.push(req.query.language)

        if (req.query.city != null) {
            query += ` AND city LIKE '%${req.query.city}%'`
            queryUserValues.push(req.query.city)
        }
    } else if (req.query.city != null) {
        query +=  ` WHERE city LIKE '%${req.query.city}%'`
        queryUserValues.push(req.query.city)

    }

    database
        .query(query, queryUserValues)
        .then(([users]) => {
             if (users !== null && users.length > 0) {
            res.json(users)
        } else {
            res.status(404).send("Not Found")
        }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");    
        })
}

const getUsersById = (req, res) => {
    const {id} = req.params

    database
        .query(` SELECT id, firstname, lastname, email, city, language FROM users where id = ${parseInt(id)}`)
        .then(([users]) => {
            // console.log(users)
            if (users[0] !== null && users.length > 0) {
                res.status(200).send(users[0])
            } else {

                res.status(404).send("Not Found") 
            }
        })
        .catch((err) => {
            console.error(err)
            res.status(500).send("Error retrieving data from database")
          })
}

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const {email} = req.body
    database.query(`SELECT * FROM users where email = ?`, email)
    .then(([user]) => {
        
        if (user[0] != null && user.length > 0) {
            req.user = user[0]
            // console.log(req.body)
            

            next()
        } else {
            res.status(401).send("Request unauthorized")
        }
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send("Error retrieving data from database")
    })
}

const postUsers = (req, res) => {
    // const {firstname, lastname, email, city, language} = req.body
    // console.log(req.body)
    database
        .query(
        //     "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ? ,?, ?)",
        // [firstname, lastname, email, city, language]
        "INSERT INTO users SET ?", req.body
        )
        .then(([result]) => {
            if (result.affectedRows > 0) {
                // res.location(`/api/movies/${movie.insertId}`).sendStatus(201)
                res.status(201).send(`Your user is created successfuly with id ${result.insertId}`)
            } else {
                res.status(403).send("Your request is forbidden")
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving the user");
        });
}

const updateUser = (req, res) => {
    const {id} = req.params
    // console.log(req.payload.sub)
    if (parseInt(id) !== req.payload.sub) {
        return res.sendStatus(403);
    }

    database.query("UPDATE users set? WHERE id = ?", [req.body, id]
    )
    .then(([user]) => {
        if (user.affectedRows === 0) {
            res.status(400).send("Not Found")
        } else {
            res.sendStatus(204)
        }
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send("Error editing the user")
    })
}

const deleteUser = (req, res) => {
    const {id} = req.params
    // console.log(req.payload.sub)
    console.log(id)

    if (parseInt(id) !== req.payload.sub) {
        return res.sendStatus(403);
    }
    
    database.query("DELETE from users WHERE id = ?", id)
    .then(([user]) => {
        if (user.affectedRows === 0) {
            res.status(400).send("Not Found")
        } else {
            res.sendStatus(204)
        }
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send("Error deleting the user")
    })
}


module.exports = {
    getUsers,
    getUsersById,
    postUsers,
    updateUser,
    deleteUser,
    getUserByEmailWithPasswordAndPassToNext
};