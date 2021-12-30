const express = require('express');
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

// create
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// get all tasks
// GET /tasks?completed=false
//          OR
// GET /tasks?completed=true
// limit / skip -> for pagination
// GET /task?limit=10&skip=0 -> first page of google
// GET /task?limit=10&skip=10 -> second page of google
// GET /task?sortBy=createdAT_asc -> ascending -> 1 for asc
// GET /task?sortBy=createdAT:desc -> descending -> -1 for desc
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        //const tasks = await Task.find({owner: req.user_id});
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

// get tasks by id
// route variable -> dynamic url
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if (!task) {
            return res.status(404).send();
        }
    
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

// update task by id
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'});
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// delete task by id
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if(!task){
            return res.status(400).send();
        }

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router