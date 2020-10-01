const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const secretKey = fs.readFileSync(__dirname + "/../a.key").toString();
const Users = require("../models/users.js");
const { check } = require("express-validator");

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
    let date = new Date()
    if (phonenumber && password) {
        let user = await Users.findOne({ Phonenumber: phonenumber })
        if (user) {
            if (password === user.Password) {
                jwt.sign({ phonenumber: user.Phonenumber, password: user.Password, time: dateuserid.getTime() }, secretKey, { expiresIn: "365d" },
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
    const { token, id } = req.body;
    if (token && id) {
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
                        let a = await Users.findOne({ _id: id })
                        if (a) {
                            if (user._id === a._id) {
                                return res.json({
                                    code: "1004",
                                    message: "the recipient is the sender"
                                })
                            } else {
                                if (user.Locked == 1) {
                                    return res.json({
                                        code: "1004",
                                        message: "User is locked"
                                    })
                                } else {
                                    let l1 = user.ListFriends;
                                    let l2 = a.ListFriends;
                                    let count = 0;
                                    for (let i = 0; i < l1.length; i++) {
                                        for (let j = 0; j < l2.length; j++) {
                                            if (l1[i].id === l2[j].id) {
                                                count = count + 1;
                                            }
                                        }
                                    }
    
                                    if (l1.length > 3000) {
                                        return res.json({
                                            code: "9994",
                                            message: "Your friends list is full"
                                        })
                                    } else if (l2.length > 3000) {
                                        return res.json({
                                            code: "9994",
                                            message: "Their friends list is full"
                                        })
                                    }
                                    let ar1 = user.Req;
                                    let ar2 = a.FriendsRequest;
                                    let c1 = false
                                    let c2 = false
                                    for(let i = 0;i<ar1.length;i++){
                                        if(ar1[i].id.toString()==a._id.toString()){
                                            console.log(i)
                                            console.log("ji")
                                            await user.Req.splice(i,1);
                                            user.save();
                                            c1=true
                                        }
                                    }
                                                                        
                                    for(let j = 0;j<ar2.length;j++){
                                        if(ar2[j].id.toString()==user._id.toString()){
                                            console.log(j)
                                            console.log("jidfghj")
                                            await a.FriendsRequest.splice(j,1);
                                            a.save();
                                            c2=true
                                        }
                                    }
                                    if(c1&&c2){
                                        return res.json({
                                            code :"1000",
                                            message : "Delete request friend"
                                        })
                                    }
                                //    let update1 = await Users.FriendsRequest.update({ _id: "5f73771dcf7957a4e70b4f88" }, { $push: { "id": "5f73771dcf7957a4e70b4f88" } });
                                //    let update2 = await Users.Req.update({ _id: user._id }, { $push: { "id": a._id } });
                                    let update1 = await user.Req.push({id:a._id});
                                    user.save()
                                    let update2 =  await a.FriendsRequest.push({id:user._id});
                                    a.save()

                                    if (update1 && update2) {
                                        return res.json({
                                            code: "1000",
                                            message: "OK"
                                        })
                                    } else {
                                        return res.json({
                                            code: "qqq",
                                            message: "update failed"
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
            code: "1002",
            message: "Missing token or userid "

        })
    }

})

router.post("/set_accept_friend/", (req, res) => {
    const { token, user_id , is_accept } = req.body;
    if (token && user_id) {
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
                        let a = await Users.findOne({ _id: user_id })
                        if (a) {
                            if (user._id === a._id) {
                                return res.json({
                                    code: "1004",
                                    message: "the recipient is the sender"
                                })
                            } else {
                                if (user.Locked == 1) {
                                    return res.json({
                                        code: "1004",
                                        message: "You were locked"
                                    })
                                } else if (a.Locked==1) {
                                    return res.json({
                                        code : "1004",
                                        message : "User was locked"
                                    })
                                } else {
                                    let ar1 = user.FriendsRequest;
                                    let check = false ;
                                    for (let i=0;i<ar1.length;i++){
                                        if(ar1[i].id.toString()==a._id.toString()){
                                            check = true;
                                            break;
                                        }
                                    }
                                    if(!check){
                                        return res.json({
                                            code :"1004",
                                            message : "Friend request is not exist"
                                        })
                                    }
                                    if(is_accept!=="0"&&is_accept!=="1"){
                                        return res.json({
                                            code :"1004",
                                            message : "Is_accept is invalid"
                                        })
                                    }
                                    let ar2 = a.Req;
                                    for(let i = 0;i<ar1.length;i++){
                                        if(ar1[i].id.toString()==a._id.toString()){
                                            await user.FriendsRequest.splice(i,1);
                                            user.save();
                                            break;
                                        }
                                    }
                                                                        
                                    for(let j = 0;j<ar2.length;j++){
                                        if(ar2[j].id.toString()==user._id.toString()){
                                            console.log(j)
                                            console.log("jidfghj")
                                            await a.Req.splice(j,1);
                                            a.save();
                                        }
                                    }
                                    if(is_accept==="1"){
                                        await user.ListFriends.push({id:a._id});
                                        await a.ListFriends.push({id:user._id});
                                        user.save()
                                        a.save()
                                        return res.json({
                                            code : "1000",
                                            message : "Accept Request"
                                        })
                                    }
                                    if(is_accept==="0"){
                                        return res.json({
                                            code : "1000",
                                            message : "Decline request"
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
            code: "1002",
            message: "Missing token or userid "

        })
    }

})


module.exports = router;