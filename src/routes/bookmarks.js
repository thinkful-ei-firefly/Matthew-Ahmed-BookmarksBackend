const express = require("express");
const router = express.Router();
const logger = require("../middleware/winston");
const BOOKMARKS = require("../store");
const uuid = require("uuid/v4");

router
  .route("/")
  .get((req, res) => {
    res.json(BOOKMARKS);
  })
  .post((req, res) => {
    console.log(req.body);
    const { title, description, url, rating } = req.body;
    if (!title || !description || !rating || !url) {
      logger.error(`Bookmark entry not complete.`);
      return res.status(400).send("entry not complete");
    }
    BOOKMARKS.push({ id: uuid(), title, description, url, rating });
    res.json(BOOKMARKS);
  });
router
  .route("/:id")
  .get((req, res) => {
    const bookmark = BOOKMARKS.find(bookmark => bookmark.id === req.params.id);
    if (!bookmark) {
      logger.error(`Bookmark with id ${req.params.id} not found.`);
      return res.status(404).send("not found");
    }
    res.status(200).json(bookmark);
  })
  .delete((req, res) => {
    const bookmarkIndex = BOOKMARKS.findIndex(
      bookmark => bookmark.id === req.params.id
    );
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${req.params.id} not found.`);
      return res.status(404).send("not found");
    }
    BOOKMARKS.splice(bookmarkIndex, 1);
    res.json(BOOKMARKS);
  });

module.exports = router;
