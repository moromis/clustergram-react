export type Opacity = "linear" | "log";
export type Ordering = "alpha" | "clust" | "rank" | "rank_var";
export type NRowSums = "all" | string | number;
export type Distribution = "cos" | string;

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
  mat?: [number, number][];
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