const json2md = require("json2md")

//const manifest = require("./manifest")
const manifest = require("./connectors/httpConnector")

console.log(manifest);

let connectionProps = [];
let connectionPropsOutput = []

let allProps = {};

//Manifest properties
for(item in manifest.accountConfigView.items) {
  let itemProp = manifest.accountConfigView.items[item].propertyName;
  console.log(itemProp);
  connectionProps.push(itemProp);
}

console.log(connectionProps);

for(propKey in manifest.properties) { 
  const prop = manifest.properties[propKey];

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

let capabilities = []
let capabilitiesOutput = []

for(capabilityKey in manifest.capabilities) {
  console.log(capabilityKey);
  const capability = manifest.capabilities[capabilityKey];

  console.log(capability)

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
      console.log(item);

      const prop = allProps[propKey];
      console.log(prop)

      /*let capPropOutput = {
        ul: [
          "Description: " + ('info' in prop ? prop.info : "undefined"),
          "Type: " + prop.preferredControlType
        ]
      }

      //Add Required: true 
      if(prop.required) {
        capPropOutput.ul.push("Required: true")
      }*/

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

        //connectionPropsOutput.push({ul: options})
        capPropList.push({ul: options});
      }    

      //capPropList.push(capPropOutput)
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
    capabilitySubTitle = capability.title;
  } else {
    capabilitySubTitle = ''
  }

  const capabilityObj = [{h3: capabilityTitle},
    {p: capabilitySubTitle},
  ];

  capabilitiesOutput.push(capabilityObj.concat(capPropList));
  capabilitiesOutput.push({hr: ""})
}

//console.log(JSON.stringify(connectionProps, null, 2))

let md = [
  {h1: manifest.name},
  {p: manifest.description},
  {h2: "Connection Properties"},
  connectionPropsOutput,
  {h2: "Capabilites"}
  /*{ul: [
    "postHTTP", 
    {ul: [
      "This is an example capability",
      "Input Schema", {ul: [
        {code: 
          {"language": "javascript",
          "content": `{key: {childkey: "value", childkey2: "value2"}}` }
        }]}
    ]}
  ]}*/
]

let final = md.concat(capabilitiesOutput);

console.log(final)

console.log(json2md(final))

