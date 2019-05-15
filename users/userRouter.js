const express = require("express");

const router = express.Router();
const userdb = require("./userDb.js");

router.post("/", validateUser, async (req, res) => {
  try {
    const user = await userdb.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      err: "There was an error while saving the post to the database"
    });
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userdb.insert(id, req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      err: "There was an error while saving the post to the database"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await userdb.get(req.body);
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "The posts information could not be retrieved." });
  }
});

router.get("/:id", validateUserId, async (req, res) => {
  try {
    const user = await userdb.getById(req.params.id);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      err: "There was an error while saving the post to the database"
    });
  }
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userdb.getUserPosts(id);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      err: "There was an error while saving the post to the database"
    });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userdb.remove(id);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      err: "The post could not be removed"
    });
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userdb.update(id, req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      err: "The post information could not be modified."
    });
  }
});

//custom middleware
//router.use(validateId); if plugged in on top like this it will apply to every route. so we attach as a argument to attach it to the endpoint on e.g... router.get...

async function validateUserId(req, res, next) {
  //validateUserId validates the user id on every request that expects a user id parameter
  try {
    const { id } = req.params;
    const user = await userdb.getById(id);

    if (user) {
      req.user = user; //if the id parameter is valid, store that user object as req.user
      next();
    } else {
      res.status(400).json({
        err: "invalid user id."
      });
    }
  } catch (err) {
    res.status(500).json({
      err: "Failed to process request."
    });
  }
}

function validateUser(req, res, next) {
  if (req.body && Object.keys(req.body).length) {
    //validateUser validates the body on a request to create a new user
    if (req.body.name !== "") {
      next();
    } else {
      res.status(400).json({
        err: "missing required name field."
      });
    }
  } else {
    res.status(400).json({
      err: "missing user data"
    });
  }
}

function validatePost(req, res, next) {
  //we want the body is defined and not an empty object
  //otherwise respond with status 400 and a useful message
  if (req.body && Object.keys(req.body).length) {
    //validatePost validates the body on a request to create a new post
    if (req.body.text !== "") {
      next();
    } else {
      res.status(400).json({
        err: "missing required text field."
      });
    }
  } else {
    res.status(400).json({
      err: "missing post data"
    });
  }
}

module.exports = router;
