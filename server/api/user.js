const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const secretKey = fs.readFileSync(__dirname + "/../a.key").toString();
const Users = require("../models/users.js");

router.post("/register/", (req, res) => {
    const { username, email, password } = req.body;

    if (username, email, password) {
        if (validators.validateUsername(username)
            && validators.validateEmail(email)
            && validators.validatePassword(password)) {
            users.checkUsernameAndEmail(username, email).then(docs => {
                if (docs) {
                    if (docs.Email === email) {
                        res.json({ status: false, message: "The email already exists" });
                    } else if (docs.Username === username) {
                        res.json({ status: false, message: "The username already exists" });
                    }
                } else {
                    users.addUser(username, email, password);

                    res.json({ status: true, message: "The user has been registered successfully" });
                }
            });
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
});

router.post("/login/", async (req, res) => {
    const { phonenumber, password } = req.body;

    if (phonenumber && password) {
        let user = await Users.findOne({ Phonenumber: phonenumber })
        if (user) {
            if (password === user.Password) {
                jwt.sign({ id: user._id }, secretKey, { expiresIn: "365d" },
                    async (err, token) => {
                        let a = await Users.findOneAndUpdate({ _id: user._id }, { Token: token })
                        if(a){
                            return res.json({
                                code: "1000",
                                message: "OK",
                                data: {
                                    token: token
                                }
                            })
                        } else {
                            return res.json({
                                message : "update failed"
                            })
                        }

                    })
            } else {
                return res.json({
                    code: "1004",
                    message: "Password is wrong"
                })
            }
        } else {
            return res.json({
                code: "9995",
                message: "User is not valided"
            })
        }

    } else {
        return res.json({
            code: "1002",
            message: "Missing phone number or password"
        });
    }
});



router.post("/logout/", (req, res) =>{
    const token = req.body.token;
    if ( token) {
        jwt.verify(token, secretKey, async (err, userData) => {
            if (err) {
                res.json({
                    code: "1004",
                    message: "Parameter value is invalid"
                });
            } else {
                const id = userData.id;
                let user = await Users.findOne({ _id: id })
                if (user) {
                    if (token === user.Token) {
                        let a = await Users.findOneAndUpdate({ _id: id }, { Token: "" })
                        if(a){
                            return res.json({
                                code: "1000",
                                message: "OK"
                            })
                        } else {
                            return res.json({
                                message : "update failed"
                            })
                        }

                    } else {
                        if(user.Token===""||user.Token===null){
                            return res.json({
                                code : "1004",
                                message : "User don't have token in db"
                            })

                        } else {
                            return res.json({
                                code: "1004",
                                message: "Token is invalid"
                            })
                        }

                    }
                } else {
                    return res.json({
                        code: "1004",
                        message: "Don't find user by token"
                    })
                }
            }
        });
    } else {
        return res.json(
            {
                code: "1002",
                message: "No have Token"
            }
        )
    }
})

module.exports = router;