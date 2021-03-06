const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");
const router = express.Router();

//   ##############   MEAL_PLAN CALENDAR  ################## //

/**
 * GET all input meal_plan for DEFAULT = true calendar.  This will be used to display
 * the main calendar (Can be further modified to only grab certain days)
 */
router.get("/", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;

  const queryText = `
    SELECT meal_plan.id AS id, meal_plan.calendar_id, meal_plan.date, recipes.id AS recipe_id, recipes.name, recipes.picture, recipes.api_id, categories.category FROM meal_plan
        JOIN calendars ON calendars.id = meal_plan.calendar_id
        JOIN calendar_shared_users ON calendar_shared_users.calendar_id = calendars.id
        JOIN recipes ON meal_plan.recipe_id = recipes.id
        JOIN categories ON meal_plan.category_id = categories.id
        WHERE calendar_shared_users.shared_user_id = $1 AND calendar_shared_users.default_calendar = TRUE
        ORDER BY meal_plan.date DESC, categories.id;`;
  pool
    .query(queryText, [userId])
    .then((result) => {
      console.log(result.rows);
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error GETting mealPlanCalendar", error);
      res.sendStatus(500);
    });
});

/**
 * GET categories, from which user can select
 */
router.get("/categories", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM categories ORDER BY id;`;
  pool
    .query(queryText)
    .then((result) => {
      console.log(result.rows);
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error GETting categories", error);
      res.sendStatus(500);
    });
});

/**
 * POST adding a meal_plan to calendar with date, category, recipe.  Verifies user is a shared_user of calendar.
 */
router.post("/", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;
  const calendarId = req.body.calendarId;
  const mealDate = req.body.date;
  const mealCategory = req.body.category;
  const recipeId = req.body.recipeId;
  const apiId = req.body.apiId;
  let isVerified;

  const verifyUserQuery = `SELECT calendar_id FROM calendar_shared_users WHERE shared_user_id = $1;`;
  const postNewMeal = `INSERT INTO "meal_plan" ("calendar_id", "date", "category_id", "recipe_id", "api_id") VALUES ($1, $2, $3, $4, $5);`;
  await pool
    .query(verifyUserQuery, [userId])
    .then((result) => {
      console.log("result rows:", result.rows);
      for (calendar of result.rows) {
        if (calendar.calendar_id == calendarId) {
          isVerified = true;
        }
      }
    })
    .catch((error) => {
      console.log("Error POSTing", error);
      res.sendStatus(500);
    });

  if (isVerified) {
    pool
      .query(postNewMeal, [calendarId, mealDate, mealCategory, recipeId, apiId])
      .then(() => {
        console.log("Success POSTing meal_plan");
        res.sendStatus(201);
      })
      .catch((error) => {
        console.log("Error POSTing meal_plan", error);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(403);
  }
});

/**
 * DELETE row from meal_plan - must be shared_user
 */
router.delete("/", rejectUnauthenticated, async (req, res) => {
  // QUERY (calendarId, mealPlan) // Come back and fix this to be one query instead of two

  let isVerified;
  const calendarId = req.query.calendarId;
  const mealPlanId = req.query.mealPlan;

  const verifyUserQuery = `SELECT calendar_id FROM calendar_shared_users WHERE shared_user_id = $1;`;
  const deleteQuery = `DELETE FROM meal_plan WHERE id = $1 AND calendar_id = $2;`; // double verification to ensure correct row is deleted. (no maliciousness)

  await pool
    .query(verifyUserQuery, [req.user.id])
    .then((result) => {
      console.log("result rows:", result.rows);
      for (calendar of result.rows) {
        if (calendar.calendar_id == calendarId) {
          isVerified = true;
        }
      }
    })
    .catch((error) => {
      console.log("Error POSTing", error);
      res.sendStatus(500);
    });

  if (isVerified) {
    pool
      .query(deleteQuery, [mealPlanId, calendarId])
      .then(() => {
        console.log("Success DELETing");
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log("Error DELETing", error);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(403);
  }
});

/**
 * PUT to update meal_plan row - only allows user to update within the same calendar
 */
router.put("/", rejectUnauthenticated, async (req, res) => {
  // BODY  /// This can be updated to be a single query
  console.log("In router.put for mealplan");
  const queryText = `UPDATE meal_plan SET date=$1, category_id=$2 WHERE id = $3 AND calendar_id = $4`;
  const verifyUserQuery = `SELECT calendar_id FROM calendar_shared_users WHERE shared_user_id = $1;`;

  const date = req.body.date;
  const category = req.body.category;
  const calendarId = req.body.calendarId;
  const mealPlanId = req.body.mealPlanId;
  let isVerified;
  console.log(req.body);
  await pool
    .query(verifyUserQuery, [req.user.id])
    .then((result) => {
      console.log("result rows:", result.rows);
      for (calendar of result.rows) {
        if (calendar.calendar_id == calendarId) {
          isVerified = true;
        }
      }
    })
    .catch((error) => {
      console.log("Error POSTing", error);
      res.sendStatus(500);
    });

  if (isVerified) {
    pool
      .query(queryText, [date, category, mealPlanId, calendarId])
      .then(() => {
        console.log("Success PUTting");
        res.sendStatus(202);
      })
      .catch((error) => {
        console.log("Error PUTting", error);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
