import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import DatePicker from '../DatePicker/DatePicker';
import { Card, Grid, Box } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import '../App/App.css';


function CalendarView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const weekPlan = useSelector((store) => store.weekPlan);
  const currentTime= new Date();
  const [nextDays, setNextDays] = useState([]);
  const [nextDates, setNextDates] = useState([]);
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


  useEffect(()=>{
    createWeek();
    dispatch({type: 'GET_WEEK_PLAN'})
    dispatch({type: 'GET_CALENDAR_LIST'})
  },[])

  const createWeek = () => {
    const dayArray = [];
    const dateArray = [];
    for (let i=0; i<8; i++){
      const dateOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate()+i);
      dayArray.push(dateOfDay.getDay());
      dateArray.push(dateOfDay);
    }
    setNextDays(dayArray);
    setNextDates(dateArray);
  }


  const handleDeleteRecipe = (mealPlanId, calendarId) => {
    dispatch({type: 'DELETE_MEAL_PLAN', payload: {mealPlanId, calendarId}})
  }


  const [mealPlanId, setMealPlanId] = useState('');
  const [calendar_id, setCalendar_id] = useState('');
  const [mealCategory, setMealCategory] = useState('');
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const handleClickOpen = () => {
  setOpen(true);
  };
  const handleEdit = (mealId, calendarId, category) => {
    setIsEdit(true);
    setMealPlanId(mealId);
    setCalendar_id(calendarId);
    setMealCategory(category)
    handleClickOpen();
  }

  const recipeDisplay = (accordionDate) => {
    const dateMealArray = []
    // console.log('recipe display accordion date', accordionDate);
    for (const meal of weekPlan){
      let newFormat = new Date(meal.date);
      // console.log('meal.date', newFormat, accordionDate);
      if (newFormat.valueOf() == accordionDate.valueOf()){
        dateMealArray.push(meal);
      }
    }
    return dateMealArray
  }

  return (
    <div className='standardBackground'>
    <Grid container justifyContent="center" spacing={1}>
      {nextDates && nextDates.map((date, i) => {     
        return(
          <Grid key={i} item xs={10} sm={7} md={7} lg={7}>
          <Accordion elevation={8} style={{backgroundColor: "#ACC8AB"}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
              id="additional-actions1-header"
            >
              <Typography>{date.getDate()} {weekDays[nextDays[i]]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Box
              display="flex"
              flexWrap="wrap"
              p={1}
              m={1}
            >
              {weekPlan && recipeDisplay(date).map(meal=>{
                return (
                  
                  <Grid key={meal.id} container justifyContent="center">
                  <Grid item >
                  <Typography variant="h6">{meal.category}: {meal.name}</Typography>
                  </Grid>
                  <Grid item xs={12} container justifyContent="center">
                  <img onClick={()=>history.push(`/recipe/${meal.recipe_id}`)} src={meal.picture} width="150px"/>
                  </Grid>
 
                  <Grid item >
                  <Button variant="contained" color="secondary" onClick={() => handleEdit(meal.id, meal.calendar_id, meal.category)}>Edit</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteRecipe(meal.id, meal.calendar_id)}><DeleteIcon /></Button>
                  </Grid>
                  </Grid>
                )
              })}
              </Box>
            </AccordionDetails>
          </Accordion>
          </Grid>
        )
      })}
      
      <DatePicker open={open} setOpen={setOpen} calendar_id={calendar_id} mealPlanId={mealPlanId} isEdit={isEdit}/>
    </Grid>
    </div>
  );
}

export default CalendarView;

// pass down calendarId from calendar view for Edit
// reference calendarId prop in Date picker as the value that gets
// sent to server, then checked against server.
