import { combineReducers } from "redux";
import errors from "./errors.reducer";
import user from "./user.reducer";
import weekPlan from "./week.plan.reducer";
import newMealPlan from "./meal.plan.reducer";
import favoritesList from "./favorites.reducer";
import categories from "./categories.reducer";
import calendars from "./calendar.list.reducer";
import recipe from "./recipe.reducer";

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  weekPlan, // holds users entire meal_plan calendar
  newMealPlan, // holds user selections for new meal plan
  favoritesList, // holds users favorite recipes
  categories, // holds category list from db
  calendars, // holds all calendars of a user
  recipe, // holds details for specific recipe
});

export default rootReducer;
