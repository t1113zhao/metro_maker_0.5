import React from "react";
import { connect } from "react-redux";

const AgencyItem = ({ operator }) => (
    <li>
        <span>
            {operator.name}
        </span>
    </li>
);


export default connect(null)(AgencyItem);