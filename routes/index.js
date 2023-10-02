var express = require("express");
var router = express.Router();
var db = require("../database");

function fetchTodos(req, res, next) {
  db.all("SELECT * FROM todos", [], function (err, rows) {
    if (err) {
      return next(err);
    }

    var todos = rows.map(function (row) {
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        due_date: row.due_date,
        completed: row.completed == 1 ? true : false,
      };
    });
    res.locals.todos = todos;
    res.locals.activeCount = todos.filter(function (todo) {
      return !todo.completed;
    }).length;
    res.locals.completedCount = todos.length - res.locals.activeCount;
    next();
  });
}

/* GET home page. */
router.get("/", fetchTodos, function (req, res, next) {
  res.locals.filter = null;
  res.json(res.locals.todos);
});
router.post(
  "/add/:id(\\d+)?",
  function (req, res, next) {
    req.params.id = req.params.id?.trim();

    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const due_date = req.body.due_date?.trim();
    const complete = req.body.complete?.trim();
    let error = [];
    if (due_date) {
      const newDate = new Date(due_date);
      if (!newDate.getDate()) error.push("Please verify due date field");
    } else {
      error.push("Please verify due date field");
    }
    if (!title) {
      error.push("Please verify title field");
    }
    if (!description) {
      error.push("Please verify description field");
    }
    if (error.length > 0)
      return res.json({
        status: "false",
        error,
        title,
      });
    next();
  },
  function (req, res, next) {
    if (req.body.title !== "") {
      return next();
    }
    return res.redirect("/add" + (req.body.filter || ""));
  },
  function (req, res, next) {
    if (req.params.id) {
      db.run(
        "UPDATE todos SET title = ?, description = ?, due_date = ? WHERE id = ?",
        [
          req.body.title,
          req.body.description,
          req.body.due_date,
          req.params.id,
        ],
        function (err) {
          if (err) {
            return next(err);
          }

          return res.json({
            status: true,
            message: "todo update successfully!!!",
          });
        }
      );
    } else
      db.run(
        "INSERT INTO todos (title, description, due_date) VALUES (?, ?, ?)",
        [req.body.title, req.body.description, req.body.due_date],
        function (err) {
          if (err) {
            return next(err);
          }
          return res.json({
            status: true,
            message: "todo added successfully!!!",
          });
        }
      );
  }
);

router.post("/complete/:id(\\d+)", function (req, res, next) {
  db.run(
    "UPDATE todos SET completed = ? WHERE id = ?",
    [1, req.params.id],
    function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        status: true,
        message: "todo status updated!!",
      });
    }
  );
});

router.post("/delete/:id(\\d+)", function (req, res, next) {
  db.run("DELETE FROM todos WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      return next(err);
    }
    return res.json({
      status: true,
      message: "todo deleted successfully!!!",
    });
  });
});

module.exports = router;
