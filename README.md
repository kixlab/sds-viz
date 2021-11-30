# sds-viz

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## How to change data files
* Navigate to the directory ``src/stores/data``
* Change or add new data file here
* Navigate to the file ``src/stores/globalStoreAgent.js``
* Change the value of the corresponding global variable among ``` [KEYWORD_CLUSTERS_FILE, BEHAVIOR_CLUSTERS_FILE, SESSIONS_FILE] ```