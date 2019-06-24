# Clustergrammer-React
A drop in Clustergrammer React component

## Install
```bash
npm install --save clustergrammer-react
```

## Use
You can pass all args object arguments as props in to the component. By default, component implements the 
biology-specific feature of loading gene information on hover. This can be overwritten by passing row_tip_callback={}

```jsx
network_data = {
    "row_nodes": [...],
    "col_nodes": [...],
    "links": [...],
    "views" : [...]
}

<Clustergrammer
    root="#clustergrammer"
    network_data={network_data}/>
```