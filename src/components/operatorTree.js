import React, { useState } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import {selectOperatorsLinesAndServicesAsTreeObject} from './reducers/rootReducer'
import {Tree} from 'antd'

// function OperatorTree(props){
//     state = 
// }

// function mapStateToProps(state, isSelectable){
//     return selectOperatorsLinesAndServicesAsTreeObject(state, isSelectable);
// }

// const mapDispatchToProps = dispatch =>{
//     return {
//         addOperator:() => dispatch({})
//     }
// }

// export default connect(
//     null,
//     {

//     }
// )