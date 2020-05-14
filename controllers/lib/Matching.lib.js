const Matching = require('../../models/Matching.model');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Sequelize = require("sequelize");
let db = require(`../../models/index`);

function extractToken(req) {
  // Extract the token
  token = req.headers.authorization.split(" ")[1];
  return jwt.decode(token);
}

// GET ALL
exports.getAll = function (req, res) {
  token = extractToken(req);

  db.Matching.findAll({
    where:
      // filter to retrieve the matching for the user
      Sequelize.or({
        UserOneId: token.id
      }, {
        UserTwoId: token.id
      }),
    attributes: [
      "id",
      "responseUserOne",
      "responseUserTwo",
      ["user_one_id", "userOne"],
      ["user_two_id", "userTwo"]
    ]
  }).then(Matchings => {
    if (Matchings) {
      res.status(200);
      res.json(Matchings);
    } else {
      res.status(404);
      res.json({
        "message": "No resources founded"
      })
    }
  }).catch(error => {
    console.log(error);
    res.status(400);
    res.json(error);
  });
};

exports.getMyMatchs = function (req, res) {
  console.log(req.params)
  db.Matching.findAll({
    where: Sequelize.or({
      UserOneId: req.params.id
    }, {
      UserTwoId: req.params.id
    }),
    attributes: [
      "id",
      "responseUserOne",
      "responseUserTwo",
      ["user_one_id", "userOne"],
      ["user_two_id", "userTwo"]
    ]
  }).then(matchings => {
    if (matchings) {
      res.status(200);
      res.json(matchings);
    } else {
      res.status(404);
      res.json({
        message: "Resource not found"
      })
    }
  }).catch(error => {
    console.log(error);
    res.status(400);
    res.json(error);
  });
};

exports.getMatch = function (req, res) {
  db.Matching.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      "id",
      "responseUserOne",
      "responseUserTwo",
      ["user_one_id", "userOne"],
      ["user_two_id", "userTwo"]
    ]
  }).then(match => {
    if (match) {
      res.status(200);
      res.json(match);
    } else {
      res.status(404);
      res.json({
        "message": "Resource not found"
      })
    }
  }).catch(error => {
    res.status(400);
    res.json(error);
  });
};


exports.patchMatching = function (req, res) {
  let userId = req.body.id;
  db.Matching.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      "id",
      "responseUserOne",
      "responseUserTwo",
      ["user_one_id", "userOne"],
      ["user_two_id", "userTwo"]
    ]
  }).then(match => {
    if (match) {
      if (match.getDataValue('userOne') == userId) {
        match.set('responseUserOne', req.body.response)
        match.save().then(() => {
          res.status(200)
          res.json(match)
        })
      } else if (match.getDataValue('userTwo') == userId) {
        match.set('responseUserTwo', req.body.response)
        match.save().then(() => {
          res.status(200)
          res.json(match)
        })
      }
    } else {
      res.status(404);
      res.json({
        "message": "Resource not found"
      })
    }
  }).catch(error => {
    res.status(400);
    res.json(error);
  });
};

exports.deleteMatching = function (req, res) {
  db.Matching.destroy({
    where: {
      id: req.params.id
    }
  }).then(Matchings => {
    // here 204 no content we only send back the status code
    res.status(204);
    res.end();
  }).catch(error => {
    res.status(400);
    res.json(error);
  });
};

exports.refresh = function (req, res) {
  token = extractToken(req);

  db.sequelize.query("SELECT do_matching(:id)", {
      replacements: {
        id: token.id
      }
    })
    .then(result => {
      db.Matching.findAll({
        where: Sequelize.or({
          UserOneId: token.id
        }, {
          UserTwoId: token.id
        }),
        attributes: [
          "id",
          "responseUserOne",
          "responseUserTwo",
          ["user_one_id", "userOne"],
          ["user_two_id", "userTwo"]
        ]
      }).then(result => {
        if (result) {
          res.status(200);
          res.json(result);
        } else {
          res.status(404);
          res.json({
            message: "Resource not found"
          })
        }
      }).catch(error => {
        res.status(400);
        res.json(error);
      })
    })
    .catch(error => {
      res.status(400);
      res.json(error);
    });
}