import axios from 'axios';
import clustergrammerGL from 'clustergrammer-gl';
import * as d3 from 'd3';
import { memoize } from 'lodash';
import React, { useEffect, useState } from 'react';

type Opacity = 'linear' | 'log';
type Ordering = 'alpha' | 'clust' | 'rank' | 'rank_var';
type NRowSums = 'all' | string | number;
type Distribution = 'cos' | string;

type NetworkDataNode = {
  name: string;
  clust: number;
  rank: number;
  rankvar?: number;
  group?: number[];
};
type NetworkDataView = {
  N_row_sum?: NRowSums;
  dist: Distribution;
  nodes: {
    row_nodes: NetworkDataNode[];
    col_nodes: NetworkDataNode[];
  };
};
type NetworkDataLink = {
  source: number;
  target: number;
  value: number;
  value_up?: boolean;
  value_dn?: boolean;
};
type NetworkData = {
  row_nodes: NetworkDataNode[];
  col_nodes: NetworkDataNode[];
  links?: NetworkDataLink[];
  mat?: number[][];
  views: NetworkDataView[];
};

interface ClustergrammerProps {
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
  row_tip_callback?: (root_id: string, row_data: NetworkDataNode) => void;
}

interface ClustergrammerGLArgs extends ClustergrammerProps {
  container: any;
  widget_callback?: (externalModel: any) => void;
  network?: any;
  viz_width?: number;
  viz_height?: number;
}

const resizeContainer = (containerId: string) => {
  const screenWidth = window.innerWidth * 0.95;
  const screenHeight = window.innerHeight * 0.925;

  d3.select(containerId)
    .style('width', screenWidth + 'px')
    .style('height', screenHeight + 'px');
};

export const ClustergramReact = (props: ClustergrammerProps) => {
  const { root: containerId } = props;
  const [geneData, setGeneData] = useState<Record<string, any>>({});

  const updateRowTooltip = memoize((root: string, symbol) => {
    d3.selectAll(root + '_row_tip').html(function () {
      return `<div><p>${symbol}</p><p>${geneData[symbol]}</p></div>`;
    });
  });

  const rowTooltipCallback = memoize((root_id: string, row_data: NetworkDataNode) => {
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
      container: d3.select(containerId),
      network_data: props.network_data
    } as ClustergrammerGLArgs;
    const cg = clustergrammerGL(clustergrammerArgs);
    d3.select(containerId + ' .loading').remove();
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
