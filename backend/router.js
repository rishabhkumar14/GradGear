// routes for different endpoints goes here
const express = require('express')
const ResourcesDAO = require("./dao.js")

const router = express.Router();

router.get("/categories", async (req, res) => {
    res.status(200).json(await ResourcesDAO.getCategories())
});

module.exports = router;