var express = require('express');
var router = express.Router();

//Get page model
var Page = require('../models/page');

/*
*   Get Page index
*/
router.get('/', (req, res) => {
    Page.find({}).sort({sorting : 1}).exec(function(err, pages){
        res.render('admin/pages', {
            pages : pages
        })
    })
})

/*
*   Get add Page
*/
router.get('/add-page', (req, res) => {
    var title = ''
    var slug = ''
    var content = ''
    res.render('./admin/add-page', {
        title : title,
        slug : slug,
        content : content
    })
})

/*
*   post add Page
*/
router.post('/add-page', (req, res) => {
    req.checkBody('title', 'Title must have value.').notEmpty()
    req.checkBody('content', 'Content must have value.').notEmpty()

    var title = req.body.title
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase()
    if(slug == '')
        slug = title.replace(/\s+/g, '-').toLowerCase()
    var content = req.body.content

    var errors = req.validationErrors() 
    if(errors){
        res.render('./admin/add-page', {
            errors : errors,
            title : title,
            slug : slug,
            content : content
        })
    }
    else{
        Page.findOne({slug : slug}, function (err, page) {
            if(page){
                req.flash('danger', 'Page slug exists, choose another.')
                res.render('./admin/add-page', {
                    title : title,
                    slug : slug,
                    content : content
                })
            }
            else{
                var page = new Page({
                    title : title,
                    slug : slug,
                    content : content,
                    sorting : 100
                })
                page.save(function(err){
                    if(err)
                        return console.log(err)
                    req.flash('success', 'Page added!')
                    res.redirect('/admin/pages')
                })
            }
        });
    }
})

//export
module.exports = router