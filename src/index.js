import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import sidebar from './sidebar'
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './app/store'

import {selectOperatorsLinesAndServicesAsTreeObject,selectLinesAndServicesAsTreeObject,selectServicesAsTreeObject} from './reducers/rootReducer'
import { addOperator, editOperator, removeOperator ,undoRemoveOperator} from './actions/operatorActions';
import { addLine, editLine, removeLine ,undoRemoveLine} from './actions/lineActions';
import { addService, editService, removeService, undoRemoveService } from './actions/serviceActions';
import { lineIDsGivenOperatorId } from './reducers/linesReducer';
import {nextIDForArray,nextKeyForArray} from './utils/utils'
ReactDOM.render(
  <React.StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

store.dispatch(addOperator('go','green'));
store.dispatch(addOperator('ttc','red'));
store.dispatch(addOperator('yrt','cyan'));

store.dispatch(editOperator('2','yrt-viva','blue'));

store.dispatch(addLine('0','stouffville','brown','commuter/regional'));
store.dispatch(addLine('0','barrie','navy blue','commuter/regional'));
store.dispatch(addLine('0','lakeshore west','maroon','commuter/regional'));
store.dispatch(addLine('0','lakeshore east','orange-red','commuter/regional'));
store.dispatch(addLine('0','milfton','orange yellow','commuter/regional'));

store.dispatch(editLine('4','milton','orange yellow','commuter/regional'));

store.dispatch(addLine('1','yonge university','yellow','heavy metro'));
store.dispatch(addLine('1','sheppard','purple','heavy metro'));
store.dispatch(addLine('1','bloor danforth','green','heavy metro'));
store.dispatch(addLine('1','eglinton','orange','light metro'));
store.dispatch(addLine('1','scarborough','cyan','light metro'));

store.dispatch(addLine('2','viva blue','blue','brt'));
store.dispatch(addLine('2','viva purple','purple','brt'));
store.dispatch(addLine('2','viva green','lime green','brt'));
store.dispatch(addLine('2','viva yellow','yellow','brt'));

store.dispatch(addService('0','stouffville RER','express'));
store.dispatch(addService('0','stouffville commuter','peak only'));
store.dispatch(addService('1','barrie RER','express'));
store.dispatch(addService('1','barrie commuter','peak only'));
store.dispatch(addService('2','lakeshore west RER','express'));
store.dispatch(addService('2','lakeshore west commuter','peak only'));
store.dispatch(addService('3','lakeshore east RER','express'));
store.dispatch(addService('3','lakeshore east commuter','peak only'));
store.dispatch(addService('4','milton commuter','peak only'));

store.dispatch(addService('5','yonge university','local'));
store.dispatch(addService('6','sheppard','local'));
store.dispatch(addService('7','bloor danforth','local'));
store.dispatch(addService('8','eglinton','local'));
store.dispatch(addService('9','scarborough','local'));

store.dispatch(editService('9','yonge university spadina','local'));

store.dispatch(addService('10','bernard terminal','local'));
store.dispatch(addService('10','newmarket','express'));
store.dispatch(addService('11','richmond hill-mccowan','local'));
store.dispatch(addService('11','martin grove-mccowan','peak only'));

store.dispatch(removeService('14'));
store.dispatch(removeService('13'));
store.dispatch(removeLine('10'));
store.dispatch(removeOperator('0'));

store.dispatch(addOperator('miway','orange'));

store.dispatch(undoRemoveService('14'));
store.dispatch(undoRemoveService('13'));
store.dispatch(undoRemoveLine('10'));
store.dispatch(undoRemoveOperator('0'));

console.log(selectOperatorsLinesAndServicesAsTreeObject(store.getState(),false))
