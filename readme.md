# RemoteComponent

## Description
This modules will help you dynamicly load React Native Component from remote url.

## Features
- Component: Remote Component is just a React Component, you can do things as you used to with React Component
- Update Dynamicly: We have somethings like Code Push for update entire app. This modules serve different purpose: To use some Components across apps. (Imagin you have to codepush bunch of apps just to fix one same Component, it's absolute possible but not convinent).
- Cache & Version control: Only fetch code from server when needed.

## Usage
```javascript
    import { View, Text, StyleSheet } from "react-native";
    import RemoteComponent, { remoteExport } from 'react-native-remote-component';
    remoteExport({ View, Text, StyleSheet });
    export default class SomeComponent extends RemoteComponent {}

    SomeComponent.defaultProps = {
       remoteSetting: {
            name: "SomeComponent", // use for save Component versioning
            url: "http://localhost:8000/output.js", 
            versioning: true // default is false
            cache: true // default is true
       }
    };
```

- Please note that if you enable versioning, the url must be an API return JSON with structure below:
```javascript
    {
        version: 'version string' // like '1.0.0',
        url: 'the url of component'
    }
```
- If you disable versioning, the url is url of component, or an API return plain text. 
- If you disable cache, RemoteComponent will fetch everytime it is mounted. and url must is url of component (return plain text)
- If you need to use ref, here is example:
```javascript
    import SomeComponent from './SomeComponent';
    
    class Demo extends Component {
        
        handlePress() {
            this.remote.comp.someMethod();
        }
    
        render() {
            return (
                <View>
                    <SomeComponent remoteSetting={someObj} ref={ref => {this.remote = ref}} />
                </View>
            )
        }
    }
```



