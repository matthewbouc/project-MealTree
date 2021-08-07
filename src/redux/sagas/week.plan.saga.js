import axios from 'axios';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

function* weekPlanSaga() {
    yield takeLatest('GET_WEEK_PLAN', getWeekPlan);
    yield takeEvery('DELETE_MEAL_PLAN', deleteMealPlan);
}

function* deleteMealPlan(action) {
    const mealPlanId = action.payload.mealPlanId;
    const calendarId = action.payload.calendarId;
    try{
        yield call(axios.delete, `/api/mealPlan?mealPlan=${mealPlanId}&calendarId=${calendarId}`)
        yield put({type: 'GET_WEEK_PLAN'})
    } catch (error) {
        console.log('Error DELETing mealPlan',error);
    }
}

// worker Saga: will be fired on "FETCH_USER" actions
function* getWeekPlan() {
  try {
    const userMealPlan = yield axios.get('/api/mealPlan');
    yield put({type: 'SET_WEEK_PLAN', payload: userMealPlan.data});
  } catch (error) {
      console.log('Error GETting or SETting reducer', error);
  }
}



export default weekPlanSaga;
