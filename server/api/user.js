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
    let date= new Date()
    if (phonenumber && password) {
        let user = await Users.findOne({ Phonenumber: phonenumber })
        if (user) {
            if (password === user.Password) {
                jwt.sign({ phonenumber: user.Phonenumber, password : user.Password,time: dateuserid.getTime()}, secretKey, { expiresIn: "365d" },
                    async (err, token) => {
                        let a = await Users.findOneAndUpdate({ _id: user._id }, { Token: token })
                        if (a) {
                            return res.json({
                                code: "1000",
                                message: "OK",
                                data: {
                                    token: token
                                }
                            })
                        } else {
                            return res.json({
                                message: "update failed"
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



router.post("/logout/", (req, res) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, secretKey, async (err, userData) => {
            if (err) {
                res.json({
                    code: "1004",
                    message: "Parameter value is invalid"
                });
            } else {
                const phonenumber = userData.phonenumber;
                let user = await Users.findOne({ Phonenumber: phonenumber })
                if (user) {
                    if (token === user.Token) {
                        let a = await Users.findOneAndUpdate({ _id: user._id }, { Token: "" })
                        if (a) {
                            return res.json({
                                code: "1000",
                                message: "OK"
                            })
                        } else {
                            return res.json({
                                message: "update failed"
                            })
                        }

                    } else {
                        if (user.Token === "" || user.Token === null) {
                            return res.json({
                                code: "1004",
                                message: "User don't have token in db"
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

router.post("/set_request_friend/", (req, res) => {
    const {token,id}=req.body;
    if(token&&id){
        jwt.verify(token, secretKey, async (err, userData) => {
            if (err) {
                res.json({
                    code: "1004",
                    message: "Parameter value is invalid"
                });
            } else {
                const phonenumber = userData.phonenumber;
                let user = await Users.findOne({ Phonenumber: phonenumber })
                if (user) {
                    if (token === user.Token) {
                        let a = await Users.findOne({_id:id})
                        if (a) {
                            if(user._id===a._id){
                                return res.json({
                                    code : "1004",
                                    message : "the recipient is the sender"
                                })
                            } else {
                                if(user.Locked==1){
                                    return res.json({
                                        code : "1004",
                                        message: "User is locked"
                                    })
                                } else {
                                    let l1 = user.ListFriends;
                                    let l2 = a.ListFriends;
                                    let count = 0;
                                    for(let i =0 ; i<l1.length;i++){
                                        for (let j =0 ; j<l2.length;j++){
                                            if(l1[i].id===l2[j].id){
                                                count = count +1;
                                            }
                                        }
                                    }
                                    if(l1.length>3000){
                                        return res.json({
                                            code :"9994",
                                            message : "Your friends list is full"
                                        })
                                    } else if(l2.length>3000){
                                        return res.json({
                                            code : "9994",
                                            message : "Their friends list is full"
                                        })
                                    }
                                   let update1 =await  Users.FriendsRequest.update({_id:a._id},{$push : {"id":user._id}});
                                   let update2 =await  Users.Req.update({_id:user._id},{$push : {"id":a._id}});
                                   if(update1&&update2){
                                       return res.json({
                                           code :"1000",
                                           message:"OK"
                                       })
                                   } else{
                                       return res.json({
                                           code :"qqq",
                                           message:"update failed"
                                       })
                                   }
                                }
                            }
                        } else {
                            return res.json({
                                code: "1004",
                                message: "Don't have user to send request"
                            })
                        }

                    } else {
                        if (user.Token === "" || user.Token === null) {
                            return res.json({
                                code: "1004",
                                message: "User don't have token in db"
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
        return res.json({
            code : "1002",
            message : "Missing token or userid "

        })
    }

})
module.exports = router;