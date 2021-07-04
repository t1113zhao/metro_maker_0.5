import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './app/store'

import {selectAgenciesLinesAndServicesAsTreeObject,selectLinesAndServicesAsTreeObject,selectServicesAsTreeObject} from './reducers/rootReducer'
import { addAgency, editAgency, removeAgency ,restoreAgency} from './actions/agencyActions';
import { addLine, editLine, removeLine ,restoreLine} from './actions/lineActions';
import { addService, editService, removeService, restoreService } from './actions/serviceActions';
import {filterDeleted, nextIDForArray} from './utils/utils'
import { selectServicesGivenLineID,selectServicesGivenAgencyID,serviceIDsGivenAgencyID } from './reducers/servicesReducer';

import { lineIDsGivenAgencyId,selectLinesGivenAgencyId } from './reducers/linesReducer';


// store.dispatch(addAgency('go','green'));
// store.dispatch(addAgency('ttc','red'));
// store.dispatch(addAgency('yrt','cyan'));

// store.dispatch(editAgency('2','yrt-viva','blue'));

// store.dispatch(addLine('0','stouffville','brown','commuter/regional'));
// store.dispatch(addLine('0','barrie','navy blue','commuter/regional'));
// store.dispatch(addLine('0','lakeshore west','maroon','commuter/regional'));
// store.dispatch(addLine('0','lakeshore east','orange-red','commuter/regional'));
// store.dispatch(addLine('0','milfton','orange yellow','commuter/regional'));

// store.dispatch(editLine('4','milton','orange yellow','commuter/regional'));

// store.dispatch(addLine('1','yonge university','yellow','heavy metro'));
// store.dispatch(addLine('1','sheppard','purple','heavy metro'));
// store.dispatch(addLine('1','bloor danforth','green','heavy metro'));
// store.dispatch(addLine('1','eglinton','orange','light metro'));
// store.dispatch(addLine('1','scarborough','cyan','light metro'));

// store.dispatch(addLine('2','viva blue','blue','brt'));
// store.dispatch(addLine('2','viva purple','purple','brt'));
// store.dispatch(addLine('2','viva green','lime green','brt'));
// store.dispatch(addLine('2','viva yellow','yellow','brt'));

// store.dispatch(addService('0','stouffville RER','express'));
// store.dispatch(addService('0','stouffville commuter','peak only'));
// store.dispatch(addService('1','barrie RER','express'));
// store.dispatch(addService('1','barrie commuter','peak only'));
// store.dispatch(addService('2','lakeshore west RER','express'));
// store.dispatch(addService('2','lakeshore west commuter','peak only'));
// store.dispatch(addService('3','lakeshore east RER','express'));
// store.dispatch(addService('3','lakeshore east commuter','peak only'));
// store.dispatch(addService('4','milton commuter','peak only'));

// store.dispatch(addService('5','yonge university','local'));
// store.dispatch(addService('6','sheppard','local'));
// store.dispatch(addService('7','bloor danforth','local'));
// store.dispatch(addService('8','eglinton','local'));
// store.dispatch(addService('9','scarborough','local'));

// store.dispatch(editService('9','yonge university spadina','local'));

// store.dispatch(addService('10','bernard terminal','local'));
// store.dispatch(addService('10','newmarket','express'));
// store.dispatch(addService('11','richmond hill-mccowan','local'));
// store.dispatch(addService('11','martin grove-mccowan','peak only'));

// store.dispatch(removeService('14'));
// store.dispatch(removeService('13'));
// store.dispatch(removeLine('10'));
// store.dispatch(removeAgency('0'));

// // store.dispatch(addAgency('miway','orange'));

// // store.dispatch(restoreService('14'));
// // store.dispatch(restoreService('13'));
// // store.dispatch(restoreLine('10'));
// store.dispatch(restoreAgency('0'));
// // store.dispatch(removeAgency('0'));

ReactDOM.render(
  <React.StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// console.log(selectAgenciesLinesAndServicesAsTreeObject(store.getState(),false))
// console.log(selectServicesGivenAgencyID(store.getState(),0,true))
// console.log(selectServicesGivenAgencyID(store.getState(),0,false))


// let testArray = [
//   {id:0,deletedAt: null},
//   {id:1,deletedAt: null},
//   {id:2,deletedAt: null},
//   {id:3,deletedAt: "today"},
// ]
