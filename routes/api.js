'use strict';
const { v4: uuidv4 } = require('uuid');

const projects = [
    {
        name: "apitest",
        data: []
    }
];

module.exports = function (app) {
    app.route('/api/issues/:project')
        .get(getIssues)
        .post(createIssue)
        .put(updateIssue)
        .delete(deleteIssue);

    function findProject(projectName) {
        let project = projects.find(p => p.name === projectName);
        if (!project) {
            project = { name: projectName, data: [] };
            projects.push(project);
        }
        return project;
    }

    function filterIssues(projectData, query) {
        return projectData.filter(issue => (
            (!query.assigned_to || issue.assigned_to === query.assigned_to) &&
            (!query.status_text || issue.status_text === query.status_text) &&
            (query.open === undefined || issue.open === (query.open === 'true')) &&
            (!query._id || issue._id === query._id) &&
            (!query.issue_title || issue.issue_title === query.issue_title) &&
            (!query.issue_text || issue.issue_text === query.issue_text) &&
            (!query.created_by || issue.created_by === query.created_by) &&
            (!query.created_on || new Date(issue.created_on).toDateString() === new Date(query.created_on).toDateString()) &&
            (!query.updated_on || new Date(issue.updated_on).toDateString() === new Date(query.updated_on).toDateString())
        ));
    }

    function getIssues(req, res) {
        try {
            const projectName = req.params.project;
            const project = findProject(projectName);
            const filteredData = filterIssues(project.data, req.query);
            res.status(200).json(filteredData);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    function createIssue(req, res) {
        try {
            const projectName = req.params.project;
            const project = findProject(projectName);
            const _id = uuidv4();
            const { issue_title, issue_text, created_by, assigned_to = "", status_text = "" } = req.body;
            const created_on = new Date();
            const updated_on = new Date();

            if (!issue_title || !issue_text || !created_by) {
                return res.status(200).json({ error: 'required field(s) missing' });
            }

            const newIssue = {
                assigned_to,
                status_text,
                open: true,
                _id,
                issue_title,
                issue_text,
                created_by,
                created_on,
                updated_on
            };

            project.data.push(newIssue);
            res.status(200).json(newIssue);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    function updateIssue(req, res) {
        try {
            const projectName = req.params.project;
            const { _id, ...updates } = req.body;

            if (!_id) {
                return res.json({ error: 'missing _id' });
            }

            if (Object.keys(updates).length === 0) {
                return res.json({ error: 'no update field(s) sent', '_id': _id });
            }

            const project = findProject(projectName);
            const issueToUpdate = project.data.find(item => item._id === _id);

            if (!issueToUpdate) {
                return res.json({ error: 'could not update', '_id': _id });
            }

            const newUpdateDate = new Date();

            Object.assign(issueToUpdate, updates, { updated_on: newUpdateDate });

            res.status(200).json({ result: 'successfully updated', '_id': _id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    function deleteIssue(req, res) {
        try {
            const projectName = req.params.project;
            const { _id } = req.body;

            if (!_id) {
                return res.json({ error: 'missing _id' });
            }

            const project = findProject(projectName);
            const issueIndex = project.data.findIndex(item => item._id === _id);

            if (issueIndex === -1) {
                return res.json({ error: 'could not delete', '_id': _id });
            }

            project.data.splice(issueIndex, 1);
            res.status(200).json({ result: 'successfully deleted', '_id': _id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
