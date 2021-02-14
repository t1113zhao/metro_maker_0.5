import React, { useState } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';

import {addOperator} from '../reducers/operatorsReducer.js'

export function TestButton(){

    const dispatch = useDispatch();

    return(
        <div>
        <button
        onclick = {() => dispatch({type: 'operators-add', payload:{name:'NewOperator', color:'#abc123'}})}>
        ClickME!!!!

        </button>

        </div>
    )
}

const mapDispatchToProps = dispatch =>{
    return {
        addOperator:() => dispatch({})
    }
}

export default connect(
    null,
    {

    }
)