const { Router } = require('express');
const topics = require('../models/topics.js');

const router = Router();

// Reset store (for testing purposes)
// Future versions whill store data in a stored variable and parts are cleared as edits are made.
// This is to make the API run faster.
router.get('/reset', topics.reset);

// Gets
router.get('/columns', topics.getColumns);

router.get('/division', topics.getDivision);
router.get('/division/:division', topics.getDivisionId);
router.get('/division/:division/:name', topics.getDivisionTopicId);

router.get('/topic', topics.getTopic);
router.get('/topic/:topic_id', topics.getTopicId);
router.get('/topic/full/:topic_id', topics.getTopicFullId);
router.get('/topic/data/:topic_id', topics.getDataId);

// Posts
router.post('/columns', topics.postColumns);
router.post('/topic', topics.postTopic);
router.post('/topic/data', topics.postData);

// Patchs
router.patch('/columns', topics.patchColumns);
router.patch('/topic', topics.patchTopic);
router.patch('/topic/data', topics.patchData);

module.exports = router;