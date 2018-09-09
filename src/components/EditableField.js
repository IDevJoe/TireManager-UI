import React, {Component} from 'react';

class EditableField extends Component {
    constructor() {
        super();
        this.edited = this.edited.bind(this);
        this.edited_sub = this.edited_sub.bind(this);
    }
    edited_sub(e) {
        e.preventDefault();
        this.edited()
    }
    edited() {
        this.props.edited(this.box.value);
        if(this.text === this.box.value) return;
        this.text = this.box.value;
    }
    render() {
        if(this.text === undefined) this.text = this.props.text;
        if(!this.props.editing)
            return <span>{this.text} <small>[<a href={"javascript:void(0)"} onClick={this.props.EP}>Edit</a>]</small></span>;
        else
            return <form onSubmit={this.edited_sub} style={{display: "inline"}}><input type={"text"} defaultValue={this.text} ref={(e) => this.box = e} onBlur={this.edited} autoFocus={true} /></form>
    }
}

export default EditableField;