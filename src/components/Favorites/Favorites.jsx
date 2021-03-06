import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DatePicker from "../DatePicker/DatePicker";
import { Grid } from "@material-ui/core";
import "../App/App.css";

function Favorites() {
  const dispatch = useDispatch();
  const history = useHistory();
  const favorites = useSelector((store) => store.favoritesList);

  useEffect(() => {
    dispatch({ type: "GET_FAVORITES_LIST" });
  }, []);

  const [recipeId, setRecipeId] = useState("");
  const [apiId, setApiId] = useState('');
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handlePlanIt = (event, id, api_id) => {
    event.stopPropagation();
    setRecipeId(id);
    setApiId(api_id);
    console.log('Ids are as follows', id, api_id);
    handleClickOpen();
  };

  const handleViewRecipe = (event, id, apiId) => {
    event.stopPropagation();
    dispatch({
      type: "GET_RECIPE_DETAILS",
      payload: {
        id: id,
        api_id: apiId
      },
      push: history.push,
      isFavorites: true,
    });
  };

  return (
    <div className="standardBackground">
      <Grid container justifyContent="center">
        <Typography variant="h6">Favorite Recipes</Typography>
      </Grid>
      <Grid container justifyContent="center">
        {favorites &&
          favorites.map((recipe, i) => {
            return (
              <Grid key={i} item xs={11} sm={7} md={7} lg={7}>
                <Accordion
                  elevation={8}
                  style={{ backgroundColor: "#ACC8AB", marginBottom: "10px" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header"
                  >
                    <Grid item container>
                      <Grid
                        item
                        container
                        xs={4}
                        alignContent="center"
                        onClick={(event) => handleViewRecipe(event, recipe.id, recipe.api_id)}
                      >
                        <img src={recipe.picture} width="100px" />
                      </Grid>
                      <Grid
                        item
                        xs={5}
                        container
                        style={{ paddingLeft: "8px", paddingRight: "8px" }}
                        alignContent="center"
                        onClick={(event) => handleViewRecipe(event, recipe.id, recipe.api_id)}
                      >
                        <Typography>{recipe.name}</Typography>
                      </Grid>
                      <Grid item xs={3} container alignContent="center">
                        <Button
                          onClick={(event) => handlePlanIt(event, recipe.id, recipe.api_id)}
                          onFocus={(event) => event.stopPropagation()}
                          variant="contained"
                          color="secondary"
                          style={{ maxWidth: "60px" }}
                        >
                          Plan
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Ingredients: {recipe.ingredients}</Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          })}

        <DatePicker open={open} setOpen={setOpen} recipeId={recipeId} apiId={apiId} />
      </Grid>
    </div>
  );
}

export default Favorites;
