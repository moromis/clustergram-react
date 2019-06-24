import * as d3 from "d3"
import $ from 'jquery';
// eslint-disable-next-line
import _ from 'lodash';
import jQuery from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min'

import React, {Component} from 'react';
import * as _Clustergrammer from 'clustergrammer';
import axios from 'axios'
import "./Clustergrammer.css"

window.$ = $;
window.jQuery = jQuery;

function resize_container(args) {
    let screen_width = window.innerWidth * .95;
    let screen_height = window.innerHeight * .925;

    d3.select(args.root)
        .style('width', screen_width + 'px')
        .style('height', screen_height + 'px');
}

class Clustergrammer extends Component {
    state = {
        gene_data: {}
    };

    update_row_tip = (root, symbol) => {
        let gene_data = this.state.gene_data;
        d3.selectAll(root + '_row_tip')
            .html(function () {
                    return `<div><p>${symbol}</p><p>${gene_data[symbol]}</p></div>`;
                }
            );
    };

    row_tip = (root_id, row_data) => {
        let gene_data = this.state.gene_data;

        if (gene_data[row_data.name] !== undefined) {
            this.update_row_tip(root_id, row_data.name)
        } else {
            axios.get('https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/' + row_data.name)
                .then(res => {

                    if (res.data['description'] !== "") {
                        gene_data[row_data.name] = res.data['description'];
                    } else {
                        gene_data[row_data.name] = "No description available.";
                    }

                    this.setState({
                        gene_data: gene_data
                    });
                    this.update_row_tip(root_id, row_data.name)
                })
        }
    };

    draw = () => {
        let args = {
            row_tip_callback: this.row_tip,
            ...this.props,
        };

        resize_container(args);

        d3.select(window).on('resize', function () {
            resize_container(args);
            cg.resize_viz();
        });

        const cg = _Clustergrammer(args);
        d3.select(cg.params.root + ' .loading').remove();
    };

    componentDidMount() {
        this.draw()
    }

    render() {
        return (
            <div className="text-center">
                <div id={this.props.root.substring(1)}>
                    <h3 className='loading'>Loading...</h3>
                </div>
            </div>
        )
    }

}

export default Clustergrammer