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