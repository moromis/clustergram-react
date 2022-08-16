# Clustergrammer-React

A drop in Clustergrammer React component

## Install

```bash
npm install --save clustergram moromis/clustergrammer-react
yarn add moromis/clustergrammer-react
```

## Use

You can pass all [args object arguments](https://clustergrammer.readthedocs.io/clustergrammer_js.html#clustergrammer-js-api) as props in to the component. By default, component implements the
biology-specific feature of loading gene information on hover. This can be overwritten by passing row_tip_callback={}

```jsx
data = {
    "row_nodes": [...],
    "col_nodes": [...],
    "links": [...],
    "views" : [...]
}

<Clustergrammer networkData={data} />
```
