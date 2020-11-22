const express = require('express')
let {v4: uuid} = require('uuid')
const bookmarkRouter = express.Router()
let bodyParser = express.json()
let logger = require('../logger')
let store = require('../store')
let {isWebUri} = require('url')

bookmarkRouter
    .route('/bookmark')
    .get((req, res) => {
        res
            .json(store.bookmarks)
    
    }).post(bodyParser, (req, res) => {
        for (let field of ['title', 'url']) {
            if (!req.body[field]) {
                logger.error(`${field} is required`)
                return res
                    .status(400).send(`${field} is required`)
            }
        }
        let { title, url, description } = req.body
        if (!isWebUri(url)) {
            logger.error(`Invalid url "${url}" supplied`)
            return res
                .status(400)
                .send(`'url' must be a valid URL`)
        }
        let bookmark = {
            id: uuid(),
            title,
            url,
            description
        }
        store.bookmarks.push(bookmark)

        logger.info(`Bookmark with id ${bookmark.id} created`)
            .status(201).location(`http://localhost:8000/bookmarks/${bookmark.id}`).json(bookmark)

        

    })

bookmarkRouter
    .route('/bookmark/:bookmark_id')
    .get((req, res) => {
        let { bookmark_id } = req.params;
        let bookmark = store.bookmarks.find(b => b.id == bookmark_id);
        if (!bookmark) {
            logger.error(`Bookmark with id ${bookmark_id} not found`);
            return res
                .status(404).send(`Card Not Found`);
        }

        res.json(bookmark)

    })
    .delete((req, res) => {
        let { bookmark_id } = req.params;
        let bookmarkIndex = bookmarks.findIndex(b => b.id == bookmark_id)
        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${bookmark_id} not found`)
            return res
                .status(404)
                .send('Not Found');
            
        }
        bookmarks.splice(bookmarkIndex, 1);
        logger.info(`Bookmark with id ${bookmark_id} deleted`);
        res
            .status(204)
            .end();

    });

    module.exports = bookmarkRouter