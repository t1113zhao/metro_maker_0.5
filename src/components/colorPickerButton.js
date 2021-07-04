import React from 'react'
import { HexColorPicker } from "react-colorful"

class ColorPickerButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,
            buttonText: "Pick Color",
        }
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState({
            color: color,
            buttonText: color
        })
        this.props.onChange(color)
    }

    render() {

        const swatchStyle = {
            backgroundColor: this.props.color,
            width: '36px',
            height: '36px',
            margin: 'auto',
            border: '2px solid'
        }
        const popover = {
            position: 'relative',
            xIndex: '0',
            zIndex: '2',
            width: '200px',
            margin: 'auto'
        }
        const cover = {
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
            margin: 'auto'
        }
        return (
            <div >
                <button onClick={this.handleClick} >Pick Color</button>
                <div style={swatchStyle} ></div>
                { this.state.displayColorPicker ? <div style={popover}>
                    <div style={cover} onClick={this.handleClose} />
                    <HexColorPicker onChange={this.handleChange} color={this.props.color} />
                </div> : null}
            </div>
        )
    }

}

export default ColorPickerButton