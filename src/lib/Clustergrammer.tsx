import * as d3 from "d3";
// eslint-disable-next-line
import 'bootstrap/dist/js/bootstrap.bundle.min';

import axios from 'axios';
import * as _Clustergrammer from 'clustergrammer';
import { memoize } from "lodash";
import React, { useEffect } from 'react';
import { useState } from "react/cjs/react.production.min";
import "./Clustergrammer.css";

function resizeContainer(args) {
    let screen_width = window.innerWidth * .95;
    let screen_height = window.innerHeight * .925;

    d3.select(args.root)
        .style('width', screen_width + 'px')
        .style('height', screen_height + 'px');
}

type ClustergrammerProps = {
    root?: string
}

const Clustergrammer = ({ root = "cg" }) => {
    const [geneData, setGeneData] = useState({});

    const updateRowTooltip = memoize((root, symbol) => {
        d3.selectAll(root + '_row_tip')
            .html(function () {
                    return `<div><p>${symbol}</p><p>${geneData[symbol]}</p></div>`;
                }
            );
    });

    const rowTooltipCallback = (root_id, row_data) => {
        if (geneData[row_data.name] !== undefined) {
            updateRowTooltip(root_id, row_data.name)
        } else {
            axios.get('https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/' + row_data.name)
                .then(res => {
                    setGeneData((prev) => ({
                        ...geneData,
                        [row_data.name]: res.data['description'] !== "" ? res.data['description'] : "No description available."
                    })
                    )
                    updateRowTooltip(root_id, row_data.name)
                })
        }
    };

    const draw = () => {
        let args = {
            row_tip_callback: rowTooltipCallback,
            root
        };

        resizeContainer(args);

        d3.select(window).on('resize', function () {
            resizeContainer(args);
            cg.resize_viz();
        });

        const cg = _Clustergrammer(args);
        d3.select(cg.params.root + ' .loading').remove();
    };

    useEffect(() => {
        draw()
    }, [])

        return (
            <div className="text-center">
                <div id={root.substring(1)}>
                    <h3 className='loading'>Loading...</h3>
                </div>
            </div>
        )
}

export default Clustergrammer