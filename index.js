import React, { Component } from "react";
import { AsyncStorage } from 'react-native';
const compareVersions = require('compare-versions');

export default class RemoteComponent extends Component {
  state = {};

  componentDidMount() {
    this.handle(this.props.remoteSetting);
  }

  componentWillReceiveProps(nextProps) {
    this.handle(nextProps.remoteSetting);
  }

  handle = remoteSetting => {
    if(typeof remoteSetting == 'undefined') return;
    let { url, versioning, cache, name } = remoteSetting;
    if(typeof url === 'undefined') return;
    cache = typeof cache == 'undefined' ? true : cache;
    versioning = typeof versioning == 'undefined' ? true : versioning;
    if(cache) {
        this.loadWithCache(url, versioning, name)
    } else {
        this.loadNormal(url)
    }
  }

  loadNormal = async url => {
    let response = await fetch(url);
    let jsString = await response.text();
    let filterJs = this.renameJS(jsString);
    eval(filterJs);
    let Component = Remote;
    this.setState({ Component });
  }


  loadWithCache = async (url, versioningEnable, name) => {
    let jsString;
    if (!global.remoteComponentCache) {
        global.remoteComponentCache = {};
    }
    if (!!remoteComponentCache[name]) {
        jsString = remoteComponentCache[name].js;
    } else if(versioningEnable) {
        let savedComponent = await AsyncStorage.getItem('remote_component_' + name);
        savedComponent = savedComponent == null ? null : JSON.parse(savedComponent);
        let currentVersion = savedComponent == null ? '0.0.0' : savedComponent.version;
        let fetchUrlResponse = await fetch(url);
        let json = await  fetchUrlResponse.json();
        
        let shouldFetch = compareVersions(json.version, currentVersion) === 1;
        if(shouldFetch) {
            let fetchComponent = await fetch(json.url);
            jsString = await fetchComponent.text();
        } else {
            jsString = savedComponent.jsString;
        }
    } else {
        let fetchComponent = await fetch(url);
        jsString = await fetchComponent.text();
    }

    let filterJs = this.renameJS(jsString);
    eval(filterJs);
    let Component = Remote;
    this.setState({ Component });
  };

  renameJS = string => string
    .replace(/"use strict";/g, "")
    .replace(/React/g, "_react2.default")
    .replace(/\(Component\)/g, "(_react.Component)")

  render() {
    let { Component } = this.state;
    if (Component) {
      return <Component ref={ref => (this.comp = ref)} {...this.props} />;
    }
    return null;
  }
}

export const remoteExport = obj => {
  if (typeof obj !== "object") {
    throw new Error("Expected object param!");
  }
  global.exportRemote = obj;
};
