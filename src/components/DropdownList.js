import React, {Component} from 'react';
import $ from 'jquery';

class EditableListObj extends Component {
    render() {
        let list = [];
        for(let x in this.props.list) {
            let x = this.props.list[x];
            list.push(<div className={"card mb-3"} key={x.id}>
                <div className={"card-body"}>
                    <div className={"row"}>
                        <div className={"col-md-10 d-flex align-items-center"}>
                            <strong>{x.name}</strong>
                        </div>
                        <div className={"col-md-2 d-flex justify-content-end"}>
                            <button className={"btn btn-link text-danger"} data-toggle="tooltip" title={"Remove"} onClick={() => {this.props.remove(x.id)}}><i className={"fas fa-times"}> </i></button>
                        </div>
                    </div>
                </div>
            </div>)
        }
        return list;
    }
}

function DropItems({items}) {
    let x = [];
    items.forEach((e) => {
        x.push(<option key={e.id}>{e.name}</option>);
    });
    return x;
}

class DropdownList extends Component {
    constructor() {
        super();
        this.itemfield = null;
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
    }
    componentDidUpdate() {
        //$("[data-toggle=tooltip]").tooltip();
    }
    add() {
        this.props.add(this.itemfield.value);
    }
    remove(id) {
        this.props.remove(id);
    }
    render() {
        return <div>
            <EditableListObj list={this.props.list} remove={this.remove} />
            <div className={"row"}>
                <div className={"col-md-9"}>
                    <select className={"form-control"} ref={(e) => this.itemfield = e}>
                        <DropItems items={this.props.items} />
                    </select>
                </div>
                <div className={"col-md-3"}>
                    <button className={"btn btn-primary"} style={{width: '100%'}} onClick={this.add}>{this.props.button_text ? this.props.button_text : 'Add to list'}</button>
                </div>
            </div>
        </div>;
    }
}

export default DropdownList;