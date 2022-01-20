const json2md = require("json2md")
const fs = require('fs')

const manifest = require("./myconnector/manifest/manifest.js")

let connectionProps = [];
let connectionPropsOutput = []

let allProps = {};

//Manifest properties
for(item in manifest.accountConfigView.items) {
  let itemProp = manifest.accountConfigView.items[item].propertyName;

  if(['customAuth', 'openid', 'oauth2'].includes(itemProp)) {

    for(subitem in manifest.accountConfigView.items[item].items) {
      let subitemProp = manifest.accountConfigView.items[item].items[subitem].propertyName;

      connectionProps.push(subitemProp)
    }

  } else {
    connectionProps.push(itemProp);
  }
}

for(propKey in manifest.properties) { 
  let propList = {};

  if(['customAuth', 'openid', 'oauth2'].includes(propKey)) {
    //Sub properties found, add all to propList
    for(subpropKey in manifest.properties[propKey].properties) {
      propList[subpropKey] = manifest.properties[propKey].properties[subpropKey]
    }
  } else {
    //Single property found, add to propList
    propList[propKey] = manifest.properties[propKey];
  }

  for(propKey in propList) {
    const prop = propList[propKey];

    //Store prop in dictionary for later use
    allProps[propKey] = prop;
    
    let displayName

    if(prop.displayName) {
      displayName = prop.displayName;
    } else {
      //Missing displayName, assume propKey is displayName
      displayName = propKey
    }

    if(connectionProps.includes(propKey)) {
      let propText = displayName
      let bt = '`'

      if(prop.preferredControlType) {

        propText += ` ${bt}${prop.preferredControlType}${bt}`
      }

      if(prop.required) {
        propText += ` ${bt}required${bt}`
      } 

      connectionPropsOutput.push({h4: propText})

      if(prop.info) {
        connectionPropsOutput.push({p: prop.info})
      }

      if(prop.options) {
        let options = []

        for(var optionKey in prop.options) {
          options.push(prop.options[optionKey].name)
        }

        connectionPropsOutput.push({ul: options})
      }
    }
  }
}

let capabilities = []
let capabilitiesOutput = []

for(capabilityKey in manifest.capabilities) {
  const capability = manifest.capabilities[capabilityKey];

  capabilities.push(capabilityKey);

  let capPropList = [];

  if(capability.flowConfigView) {

    for(itemKey in capability.flowConfigView.items) {
      const item = capability.flowConfigView.items[itemKey];

      if('screenId' in item) {
        //UI component will not document 
        continue
      }

      const propKey = item.propertyName;

      const prop = allProps[propKey];

      let displayName;

      if(prop.displayName) {
        displayName = prop.displayName;
      } else {
        //Missing displayName, assume propKey is displayName
        displayName = propKey
      }

      let propText = displayName
      let bt = '`'

      if(prop.preferredControlType) {

        propText += ` ${bt}${prop.preferredControlType}${bt}`
      }

      if(prop.required) {
        propText += ` ${bt}required${bt}`
      }

      capPropList.push({h4: propText})

      if(prop.info) {
        capPropList.push({p: prop.info})
      }

      if(prop.options) {
        let options = []

        for(var optionKey in prop.options) {
          options.push(prop.options[optionKey].name)
        }

        capPropList.push({ul: options});
      }    
    }
  }

  let capabilityTitle;
  let capabilitySubTitle; 

  if(capability.title) {
    capabilityTitle = capability.title + ` (${capabilityKey})`
  }
  else {
    capabilityTitle = capabilityKey;
  }

  if(capability.subTitle) {
    capabilitySubTitle = capability.subTitle;
  } else {
    capabilitySubTitle = ''
  }

  const capabilityObj = [{h3: capabilityTitle},
    {p: capabilitySubTitle},
  ];

  capabilitiesOutput.push(capabilityObj.concat(capPropList));
  capabilitiesOutput.push({hr: ""})
}

let md = [capabilitiesOutput]

var finalCapabilities = json2md(md)
var finalContributed = '';

//Read CONTRIBUTED.md and replace capabilities section 
try {
  const contributed = fs.readFileSync('./myconnector/docs/CONTRIBUTED.md', 'utf8')
  console.log('Reading docs/CONTRIBUTED.md and inserting capabilities section')
  finalContributed = contributed.replace(/Leave this section blank: it will be generated automatically/g, finalCapabilities);
} catch (err) {
  console.error(err)
}

//Output final README.md
try {
  console.log('Generated final docs/README.md')
  fs.writeFileSync('./myconnector/docs/README.md', finalContributed)
} catch (err) {
  console.error(err)
}




