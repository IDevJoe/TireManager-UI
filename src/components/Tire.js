import React, {Component} from 'react';
import * as api from '../api';
import swal from 'sweetalert2';
import EditableField from "./EditableField";

const electron = window.require('electron');

class Tire extends Component {
    constructor() {
        super();
        this.printTag = this.printTag.bind(this);
        this.archiveTire = this.archiveTire.bind(this);
        this.changeCar = this.changeCar.bind(this);
        this.changeManu = this.changeManu.bind(this);
        this.changeSize = this.changeSize.bind(this);
        this.addRace = this.addRace.bind(this);
        this.subRace = this.subRace.bind(this);
        this.editComments = this.editComments.bind(this);
        this.editType = this.editType.bind(this);
        this.state = {exists: true, EC: false, EM: false, ES: false, ERC: false};
        this.tpood = false;
    }
    printTag() {
        if(this.tpood) api.getTag(this.props.tire.serial).then((e) => {
            electron.ipcRenderer.send("print_tag", e.image);
        });
        else electron.ipcRenderer.send("print_tag", this.props.tag);
    }
    archiveTire() {
        api.deleteTire(this.props.tire.serial);
        this.setState({exists: false});
        swal("Tire successfully deleted.");
    }
    changeCar(n) {
        api.edit(this.props.tire.serial, {car: n});
        this.setState({EC: false});
        this.tpood = true;
    }
    changeManu(n) {
        api.edit(this.props.tire.serial, {manufacturer: n});
        this.setState({EM: false});
        this.tpood = true;
    }
    changeSize(n) {
        api.edit(this.props.tire.serial, {size: n});
        this.setState({ES: false});
        this.tpood = true;
    }
    addRace() {
        api.modRaces(this.props.tire.serial, true);
        this.props.tire.race_count++; // This is kinda a cheaty way of doing things, but eh.
        this.forceUpdate();
        this.tpood = true;
    }
    subRace() {
        api.modRaces(this.props.tire.serial, false);
        this.props.tire.race_count--;
        this.forceUpdate();
        this.tpood = true;
    }
    editComments() {
        api.edit(this.props.tire.serial, {comments: this.comments.value === '' ? null : this.comments.value});
        this.tpood = true;
    }
    editType() {
        api.edit(this.props.tire.serial, {type: this.type.value});
        this.tpood = true;
    }
    render() {
        if(!this.state.exists) return null;
        return <div className="card">
            <div className="card-body">
                <div className={"row"}>
                    <div className={"col-md-9"}>
                        <h3><EditableField text={this.props.tire.car} edited={this.changeCar} editing={this.state.EC} EP={() => this.setState({EC: true})} /> / {this.props.tire.serial}</h3>
                        <h4><EditableField text={this.props.tire.manufacturer} edited={this.changeManu} editing={this.state.EM} EP={() => this.setState({EM: true})} /></h4>
                        <p>Size <EditableField text={ this.props.tire.size } edited={this.changeSize} editing={this.state.ES} EP={() => this.setState({ES: true})} />, in { this.props.tire.race_count } {this.props.tire.race_count !== 1 ? 'races' : 'race'}</p>
                        <textarea defaultValue={this.props.tire.comments} className={"form-control"} ref={(e) => this.comments = e} onBlur={this.editComments} disabled={this.props.tire.deleted_at != null}></textarea>
                        <select className={"form-control mt-2"} style={{width: '30%'}} defaultValue={this.props.tire.type} ref={(e) => this.type = e} onChange={this.editType} disabled={this.props.tire.deleted_at != null}>
                            <option value={"GEN"} disabled>Select type</option>
                            <option>LF</option>
                            <option>LR</option>
                            <option>RF</option>
                            <option>RR</option>
                        </select>
                        <p></p>
                    </div>
                    <div className={"col-md-3"}>
                        {this.props.tag ? <img src={this.props.tag} alt={"Tag thumbnail"} width={"100%"} /> : ''}
                    </div>
                </div>
                {
                    this.props.tire.deleted_at != null ? <a href="javascript:void(0)" className={"card-link"}>Recover</a>
                        :
                        <div>
                            {this.props.tag ? <a href="javascript:void(0)" className={"card-link"} onClick={this.printTag}>Print Tag</a> : ''}
                            <a href={"javascript:void(0)"} className={"card-link"} onClick={this.addRace}>+ Race</a>
                            <a href={"javascript:void(0)"} className={"card-link"} onClick={this.subRace}>- Race</a>
                            <a href="javascript:void(0)" className={"card-link"} onClick={this.archiveTire}>Archive</a>
                        </div>
                }
            </div>
        </div>;
    }
}

export default Tire;