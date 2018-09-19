import React, {Component} from 'react';
import * as api from '../../api';
import swal from 'sweetalert2';
import Tire from "../../components/Tire";
import DropdownList from "../../components/DropdownList";

class SearchTire extends Component {

    constructor() {
        super();
        this.search = this.search.bind(this);
        this.state = {tire: null, tire_tag: null, cut_templates: [], cuts: []};
        this.addCut = this.addCut.bind(this);
        this.removeCut = this.removeCut.bind(this);
    }

    search(e) {
        e.preventDefault();
        let val = this.inp.value;
        api.getTire(val).then((e) => {
            this.inp.select();
            if(e.code !== 200) {
                swal({text: "Tire serial was not registered, or is archived.", focusConfirm: true});
                return;
            }
            api.getTag(val).then((ee) => {
                this.setState({tire: e.tire, tire_tag: ee.image});
            });
            console.log(e);
        });
        api.fetchCutTemplates().then((e) => {
            this.setState({cut_templates: e.templates});
        });
        api.fetchTireCuts(val).then((e) => {
            this.setState({cuts: e.cuts});
        });
    }

    addCut(name) {
        let a = this.state.cuts.slice(0);
        api.addTireCut(this.state.tire.serial, {name: name}).then((e) => {
            a.push(e.cut);
            this.setState({cuts: a});
        });
    }

    removeCut(id) {
        api.deleteCut(id);
        let cl = this.state.cuts.slice(0);
        let x = cl.find((e) => e.id === id);
        let i = cl.indexOf(x);
        cl.splice(i, 1);
        this.setState({cuts: cl});
    }

    render() {
        return <div>
            <h4>Generic Tire Search</h4>
            <form onSubmit={this.search}>
                <input className={"form-control"} placeholder={"Scan barcode or enter serial"} autoFocus={true} ref={(e) => this.inp = e} />
            </form>
            <div className={"mt-3"}>
                {this.state.tire != null ? <Tire tire={this.state.tire} tag={this.state.tire_tag}/> : ''}
            </div>
            <hr className={"mb-3"} />
            {this.state.tire != null ? <DropdownList list={this.state.cuts} items={this.state.cut_templates} button_text={"Add cut"} remove={this.removeCut} add={this.addCut}/> : ''}
        </div>
    }

}

export default SearchTire;