import React, {Component} from 'react';
import * as api from '../../api';
import EditableList from "../../components/EditableList";
import gear from '../../loadingicons/Gear-1s-200px.gif';

class CutTemplates extends Component {
    constructor() {
        super();
        this.state = {templates: [], load_icon: true};
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
    }
    componentDidMount() {
        api.fetchCutTemplates().then((e) => {
            this.setState({templates: e.templates, load_icon: false});
        });
    }
    remove(id) {
        console.log("REMOVE "+id);
        api.deleteCut(id);
        let cl = this.state.templates.slice(0);
        let x = cl.find((e) => e.id === id);
        let i = cl.indexOf(x);
        cl.splice(i, 1);
        this.setState({templates: cl});
    }
    add(name) {
        console.log("ADD "+name);
        api.addCutTemplate({name: name}).then((e) => {
            let cl = this.state.templates.slice(0);
            cl.push(e.template);
            this.setState({templates: cl});
        });
    }
    render() {
        return <div>
            <h4>Cut Templates {this.state.load_icon ? <img src={gear} height={'30px'}/> : ''}</h4>
            <hr />
            <EditableList list={this.state.templates} remove={this.remove} add={this.add}/>
        </div>
    }
}

export default CutTemplates;