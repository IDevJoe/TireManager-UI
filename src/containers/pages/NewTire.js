import React, {Component} from 'react';
import * as api from '../../api';
import swal from 'sweetalert2';

const electron = window.require('electron');

class NewTire extends Component {
    constructor() {
        super();
        this.create = this.create.bind(this);
        this.state = {validation: {serial: null, size: null, manufacturer: null, type: null, comments: null, car: null}}
    }
    create(e) {
        e.preventDefault();
        let serial = this.serial.value;
        api.registerTire({
            serial: this.serial.value,
            car: this.car.value,
            size: this.size.value,
            manufacturer: this.manufacturer.value,
            type: this.type.value,
            comments: this.comments.value
        }).then((e) => {
            let ns = {serial: null, size: null, manufacturer: null, type: null, comments: null};
            this.setState({validation: ns});
            if(e.code === 422) {
                if(e.validation !== undefined) {
                    let parsed = api.parseValidation(ns, e.validation);
                    console.log(parsed);
                    this.setState({validation: parsed});
                    return;
                }
                swal({text: "An internal server error occured."});
                return;
            }
            swal({title: "Success!", text: "Tire successfully added. Print tag now?", type: "question", showCancelButton: true, confirmButtonText: "Print", cancelButtonText: "No"})
                .then((result) => {
                    if(!result.value) return;
                    api.getTag(serial).then((e) => {
                        electron.ipcRenderer.send("print_tag", e.image);
                    });
                });
            this.serial.value = "";
            this.car.value = "";
            this.size.value = "10";
            this.manufacturer.value = "";
            this.type.value = "LF";
            this.comments.value = "";
            console.log(e);
        });
    }
    render() {
        return <div>
            <h4>New Tire Form</h4>
            <form onSubmit={this.create}>
                <div className={"row"}>
                    <div className={"col-md-4 form-group"}>
                        <label htmlFor={"serial"}>Serial No.</label>
                        <input type={"text"} className={"form-control" + (this.state.validation.serial != null ? ' is-invalid' : '')} id={"serial"} ref={(e) => this.serial = e} />
                        { (this.state.validation.serial != null ? <small className={"invalid-feedback"}>{this.state.validation.serial}</small> : '') }
                    </div>
                    <div className={"col-md-4 form-group"}>
                        <label htmlFor={"car"}>Car</label>
                        <input type={"text"} className={"form-control" + (this.state.validation.car != null ? ' is-invalid' : '')} id={"car"} ref={(e) => this.car = e} />
                        { (this.state.validation.car != null ? <small className={"invalid-feedback"}>{this.state.validation.car}</small> : '') }
                    </div>
                    <div className={"col-md-4 form-group"}>
                        <label htmlFor={"size"}>Size</label>
                        <input type={"number"} className={"form-control" + (this.state.validation.size != null ? ' is-invalid' : '')} id={"size"} defaultValue={10} ref={(e) => this.size = e} />
                        { (this.state.validation.size != null ? <small className={"invalid-feedback"}>{this.state.validation.size}</small> : '') }
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-md-6 form-group"}>
                        <label htmlFor={"manufacturer"}>Manufacturer</label>
                        <input type={"text"} className={"form-control" + (this.state.validation.manufacturer != null ? ' is-invalid' : '')} id={"manufacturer"} ref={(e) => this.manufacturer = e} />
                        { (this.state.validation.manufacturer != null ? <small className={"invalid-feedback"}>{this.state.validation.manufacturer}</small> : '') }
                    </div>
                    <div className={"col-md-6 form-group"}>
                        <label htmlFor={"type"}>Type</label>
                        <select className={"form-control" + (this.state.validation.type != null ? ' is-invalid' : '')} id={"type"} ref={(e) => this.type = e}>
                            <option>LF</option>
                            <option>LR</option>
                            <option>RF</option>
                            <option>RR</option>
                        </select>
                        { (this.state.validation.type != null ? <small className={"invalid-feedback"}>{this.state.validation.type}</small> : '') }
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-md-12 form-group"}>
                        <label htmlFor={"comments"}>Comments</label>
                        <textarea className={"form-control" + (this.state.validation.comments != null ? ' is-invalid' : '')} id={"comments"} ref={(e) => this.comments = e}></textarea>
                        { (this.state.validation.comments != null ? <small className={"invalid-feedback"}>{this.state.validation.comments}</small> : '') }
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-md-12"}>
                        <div className={"d-flex justify-content-end"}>
                            <button className={"btn btn-primary"}>Create</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>;
    }
}

export default NewTire;