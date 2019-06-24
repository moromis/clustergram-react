import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Clustergrammer} from "./lib"
import axios from "axios";

class App extends Component {
    state = {
        data: null
    };

    componentDidMount = () => {
        axios.get('http://127.0.0.1:5000/jammit/29/29/clustergrammer/mRNA Expression')
            .then(res => {
                this.setState({
                    data: res.data
                })
            })
    };

    render() {
        if (this.state.data !== null) {
            return (
                <div>
                    <Clustergrammer
                        root="#clustergrammer"
                        network_data={this.state.data}/>
                </div>
            )
        } else {
            return null
        }
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));