const Environment = require('../models/environment.js');
const { check, validationResult } = require('express-validator');

exports.create = (req, res) => {
  // validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  Environment.where({name: req.body.name}).findOne(function(err, environment) {
      if (environment) {
        res.status(409).send({
            message: "Environment with name " + req.body.name + " already exists."
        });
      } else {
        //create new environment
        const environment = new Environment({
          name: req.body.name
        });

        //save the environment
        environment.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the environment."
            });
        });
      }
  });
};

exports.findAll = (req, res) => {
  Environment.find()
  .then(environments => {
     res.send(environments);
  }).catch(err => {
     res.status(500).send({
         message: err.message || "Some error occurred while retrieving environments."
     });
  });
};

exports.findOne = (req, res) => {
    Environment.findById(req.params.environmentId)
    .then(environment => {
        if(!environment) {
            return res.status(404).send({
                message: "Environment not found with id " + req.params.environmentId
            });
        }
        res.send(environment);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Environment not found with id " + req.params.environmentId
            });
        }
        return res.status(500).send({
            message: "Error retrieving environment with id " + req.params.environmentId
        });
    });
};

exports.update = (req, res) => {
  // validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Find environment and update it with the request body
  Environment.findByIdAndUpdate(req.params.environmentId, {
      name: req.body.name
  }, {new: true})
  .then(environment => {
      if(!environment) {
          return res.status(404).send({
              message: "Environment not found with id " + req.params.environmentId
          });
      }
      res.send(environment);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Environment not found with id " + req.params.environmentId
          });
      }
      return res.status(500).send({
          message: "Error updating environment with id " + req.params.environmentId
      });
  });
};

exports.delete = (req, res) => {
  Environment.findByIdAndRemove(req.params.environmentId)
  .then(environment => {
      if(!environment) {
          return res.status(404).send({
              message: "Environment not found with id " + req.params.environmentId
          });
      }
      res.send({message: "Environment deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "Environment not found with id " + req.params.environmentId
          });
      }
      return res.status(500).send({
          message: "Could not delete environment with id " + req.params.environmentId
      });
  });
};
