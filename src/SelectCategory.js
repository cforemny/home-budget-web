import {Component} from 'react';
import axios from "axios";
import Select from 'react-select'

class SelectCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectOptions: [],
            id: "",
            description: ''
        }
    }

     getOptions() {
        const res =  axios.get('/categories')
        const data = res.data

        const options = data.map(d => ({
            "value": d.id,
            "label": d.description,
            "name": d.description
        }))
        this.setState({selectOptions: options})
    }

    componentDidMount() {
        this.getOptions()
    }

    render() {

        return (
            <Select options={this.state.selectOptions} placeholder='Wybierz kategorie' onChange={this.handleChange}/>
        )
    }
}

export default SelectCategory;