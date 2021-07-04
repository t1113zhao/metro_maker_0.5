import React from "react";
import { connect } from "react-redux";
import { addAgency } from '../actions/agencyActions'
import ColorPickerButton from "./colorPickerButton";

const defaultName = "Unnamed Agency"
const defaultColor = "#888888"

class AddAgency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: defaultName,
            color: defaultColor
        }
    }

    updateNameInput = input => {
        this.setState({
            name: input
        })
    };

    updateColorInput = input => {
        this.setState({
            color: input
        })
    };

    handleAddAgency = () => {
        this.props.addAgency(this.state.name, this.state.color);
        this.setState({
            name: defaultName,
            color: defaultColor
        })
    };

    render() {
        return (
            < div >
                <input
                    type="text"
                    onChange={e => this.updateNameInput(e.target.value)}
                    defaultValue={this.state.name}
                />
                <input
                    type="text"
                    onChange={e => this.updateColorInput(e.target.value)}
                    value={this.state.color}
                /> <ColorPickerButton color={this.state.color} onChange={this.updateColorInput.bind(this)} />
                <button className="add-agency" onClick={this.handleAddAgency}>
                    Add Agency
                </button>
            </div >
        )
    }
}

export default connect(
    null,
    { addAgency }
)(AddAgency);
