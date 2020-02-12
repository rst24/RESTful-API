const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
router.post('/signup', (req, res, next)=>{
    user.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user){
            return res.status(409).json({
                message: 'Email exists'
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash)=> {
                if(user.length >= 1){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new user({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });
                user
                .save()
                .then(result => {
                    res.status(201).json({
                        message:'User created'
                    })
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
            }
        });
        }
    })
    .catch();
    
});
router.post('/login', (req, res, next)=>{
    user.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message:'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, res)=>{
            if(err){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if(result){
                jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY,
                    {
                        expiresIn: '1hr'
                    })
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                })
            }
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})
router.delete('/:userId', (req,res,next)=>{
    user.remove({_id: req.params.userId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'User deleted'
        })
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
});
});

module.exports = router;