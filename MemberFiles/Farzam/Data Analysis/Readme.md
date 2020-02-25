## Farzam

<!-- ![Subway](./TehranSubway.PNG)   -->

### Instalation Guide:
* Clone git repository  
* Install yarn or npm(node package manager)  
* Install required node modules using yarn or npm  
`yarn add babel-cli babel-core babel-loader`  
`yarn add babel-preset-react babel-preset-env`  
`yarn add react react-dom`  
* Build and start files
`babel src/app.js --out-file=public/scripts/app.js --presets=env,react` 
* Output files are generated in scripts folder  