import React, { useState } from 'react'
import { connect } from 'react-redux'
import ColorPickerButton from './colorPickerButton.js'

import { selectAllAgencies } from '../reducers/agenciesReducer.js'
import AddAgency from './addAgency.js'
import AgencyItem from './agencyItem'

class ManagementPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <AddAgency />
                <ul className="operator-list">
                    {this.props.agencies && this.props.agencies.length ? this.props.agencies.map((agency, index) => {
                        return <AgencyItem operator={agency} />
                    })
                        : "No Angecies"
                    }
                </ul>
            </div>

        )
    }
}

const mapStateToProps = state => {
    const agencies = selectAllAgencies(state.agencies);

    return { agencies }
};

export default connect(mapStateToProps)(ManagementPanel);
