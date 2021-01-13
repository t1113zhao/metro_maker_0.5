import { useSelector, useDispatch } from 'react-redux';
import {removeOperator} from '../reducers/operatorsReducer.js'


function removeOperator(id){
    dispatchEvent(removeOperator(id))
}