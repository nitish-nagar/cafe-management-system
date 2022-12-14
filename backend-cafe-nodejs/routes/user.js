const e = require('express');
const express = require('express');
const connection = require('../connection');
const router = express.Router();


const jwt = require('jsonwebtoken');
require("dotenv").config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');
const sendEmail = require('../email/mock') // For mocking email, check console log for email checking
//const sendEmail = require('../email/gmail') // For gmail

router.post('/signup', (req, resp) => {
    let user = req.body;
    let query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        console.log(query);
        console.log(user);
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name, contactNumber, email, password, status, role) values (?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return resp.status(200).json({ message: "Successfully registered" });
                    }
                    else
                        return resp.status(500).json({ message: err });
                });
            }
            else
                return resp.status(400).json({ message: "Email address already exists" })
        }
        else
            return resp.status(500).json(err);
    })
});

router.post("/login", (req, resp) => {
    const user = req.body;
    query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        console.log(results);
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password)
                return resp.status(401).json({ message: "Incorrect username or password" });
            else if (results[0].status === 0) {
                return resp.status(401).json({ message: "Wait for admin approval" });
            }
            else if (results[0].password === user.password) {
                const payload = { email: results[0].email, role: results[0].role };
                accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                resp.status(200).json({ token: accessToken });
            }
            else return resp.status(400).json({ message: "Something went wrong. Please try again later." });
        }
        else
            return resp.status(500).json(err);
    });
});

router.post("/validate", (req, resp) => {
    try {
        const token = req.body.token;
        accessToken = jwt.verify(token, process.env.ACCESS_TOKEN, { complete: true });
        console.log(accessToken);
        return resp.status(200).json({ message: "Valid token" });
    }
    catch {
        return resp.status(401).json({ message: "Invalid token" });
    }
});

router.post("/forgotPassword", (req, resp) => {
    const user = req.body;
    query = "select email, password from user where email=?";
    connection.query(query, [user.email], async (err, results) => {
        console.log(results);
        if (!err) {
            if (results.length <= 0) {
                console.log("Email not in the database");
            }
            else {
                let result = await sendEmail(results[0].email, process.env.EMAIL_USER, "Password by Cafe Management System", `<p><b>Your login details</b><br/><b>Email:</b> ${results[0].email}<br/><b>Password:</b> ${results[0].password}<br/><br/><a href='${req.protocol + '://' + req.get("host")}' target='_blank' rel='noopener noreferrer'>Click here to login with your credentials</a></p>`);
                console.log("Result - " + result); // If you want to log what result was
            }
        }
        else
            return resp.status(500).json(err);
    });
    return resp.status(200).json({ message: "If the email associated matches with our records then we will send you details." });
});


router.get("/get", auth.authenticateToken, checkRole.checkRole, (req, resp) => {
    let query = "select id, name, contactNumber, email, status from user where role ='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return resp.status(200).json(results);
        }
        else {
            return resp.status(500).json(err);
        }
    });
});

router.patch("/update", auth.authenticateToken, (req, resp) => {
    let user = req.body;
    let query = "update user set status =? where id=? and email!='admin@gmail.com'";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows === 1) {
                resp.status(200).json({ message: "Update successfully" })
            }
            else {
                resp.status(400).json({ message: "Issue updating the status. Please provide correct id." })
            }
        }
        else
            resp.status(500).json(err);
    });
});

router.get('/checkToken', auth.authenticateToken, (req, resp) => {
    return resp.status(200).json({ message: "true" })
})

router.post('/changePassword', auth.authenticateToken, (req, resp) => {
    let user = req.body;
    const email = resp.locals.email;
    var query = "select * from user where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect old password" });
            }
            else if (results[0].password == user.oldPassword) {
                query = "update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password updated successfully" })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({ message: "Something went wrong. Please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
});

module.exports = router;