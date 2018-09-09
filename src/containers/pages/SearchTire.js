import React, {Component} from 'react';
import * as api from '../../api';
import swal from 'sweetalert2';
import Tire from "../../components/Tire";

class SearchTire extends Component {

    constructor() {
        super();
        this.search = this.search.bind(this);
        this.state = {tire: null, tire_tag: null};
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
        })
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
        </div>
    }

}

export default SearchTire;