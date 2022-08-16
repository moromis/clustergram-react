import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as _Clustergrammer from 'clustergrammer';
import * as d3 from "d3";
import { memoize } from "lodash";
import React, { useEffect } from 'react';
import { useState } from "react/cjs/react.production.min";
import "./Clustergrammer.css";

const resizeContainer = (containerId: string) => {
    const screenWidth = window.innerWidth * .95;
    const screenHeight = window.innerHeight * .925;

    d3.select(containerId)
        .style('width', screenWidth + 'px')
        .style('height', screenHeight + 'px');
}

type ClustergrammerProps = {
    containerId?: string
}

const Clustergrammer = ({ containerId = "cg" }) => {
    const [geneData, setGeneData] = useState({});

    const updateRowTooltip = memoize((root, symbol) => {
        d3.selectAll(root + '_row_tip')
            .html(function () {
                    return `<div><p>${symbol}</p><p>${geneData[symbol]}</p></div>`;
                }
            );
    });

    const rowTooltipCallback = memoize((root_id, row_data) => {
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
    });

    const draw = () => {

        resizeContainer(containerId);

        d3.select(window).on('resize', function () {
            resizeContainer(containerId);
            cg.resize_viz();
        });

        const clustergrammerArgs = {
            row_tip_callback: rowTooltipCallback,
            root: containerId
        };
        const cg = _Clustergrammer(clustergrammerArgs);
        d3.select(cg.params.root + ' .loading').remove();
    };

    useEffect(() => {
        draw()
    }, [])

        return (
            <div className="text-center">
                <div id={containerId.substring(1)}>
                    <h3 className='loading'>Loading...</h3>
                </div>
            </div>
        )
}

export default Clustergrammer