import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as _Clustergrammer from 'clustergrammer';
import * as d3 from 'd3';
import { memoize } from 'lodash';
import { useEffect, useState } from 'react';
import './Clustergrammer.css';

export type Opacity = 'linear' | 'log';
export type Ordering = 'alpha' | 'clust' | 'rank' | 'rank_var';
export type NRowSums = 'all' | string | number;
export type Distribution = 'cos' | string;

export type NetworkDataNode = {
  name: string;
  clust: number;
  rank: number;
  rankvar?: number;
  group?: number[];
};
export type NetworkDataView = {
  N_row_sum?: NRowSums;
  dist: Distribution;
  nodes: {
    row_nodes: NetworkDataNode[];
    col_nodes: NetworkDataNode[];
  };
};
export type NetworkDataLink = {
  source: number;
  target: number;
  value: number;
  value_up?: boolean;
  value_dn?: boolean;
};
export type NetworkData = {
  row_nodes: NetworkDataNode[];
  col_nodes: NetworkDataNode[];
  links?: NetworkDataLink[];
  mat?: number[][];
  views: NetworkDataView[];
};

export interface ClustergrammerProps {
  root: string;
  network_data: NetworkData;
  row_label?: string;
  col_label?: string;
  row_label_scale?: number;
  col_label_scale?: number;
  super_label_scale?: number;
  opacity_scale?: Opacity;
  input_domain?: number;
  do_zoom?: boolean;
  tile_colors?: [string, string];
  row_order?: Ordering;
  col_order?: Ordering;
  ini_view?: string;
  about?: string;
  row_tip_callback?: () => string;
}

const resizeContainer = (containerId: string) => {
  const screenWidth = window.innerWidth * 0.95;
  const screenHeight = window.innerHeight * 0.925;

  d3.select(containerId)
    .style('width', screenWidth + 'px')
    .style('height', screenHeight + 'px');
};

const Clustergrammer = (props: ClustergrammerProps) => {
  const { root: containerId } = props;
  const [geneData, setGeneData] = useState<Record<string, any>>({});

  const updateRowTooltip = memoize((root, symbol) => {
    d3.selectAll(root + '_row_tip').html(function () {
      return `<div><p>${symbol}</p><p>${geneData[symbol]}</p></div>`;
    });
  });

  const rowTooltipCallback = memoize((root_id, row_data) => {
    if (geneData[row_data.name] !== undefined) {
      updateRowTooltip(root_id, row_data.name);
    } else {
      axios.get('https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/' + row_data.name).then((res) => {
        setGeneData((prev) => ({
          ...geneData,
          [row_data.name]: res.data['description'] !== '' ? res.data['description'] : 'No description available.',
        }));
        updateRowTooltip(root_id, row_data.name);
      });
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
      root: containerId,
    };
    const cg = _Clustergrammer(clustergrammerArgs);
    d3.select(cg.params.root + ' .loading').remove();
  };

  useEffect(() => {
    draw();
  }, []);

  return (
    <div className="text-center">
      <div id={containerId.substring(1)}>
        <h3 className="loading">Loading...</h3>
      </div>
    </div>
  );
};

export default Clustergrammer;
