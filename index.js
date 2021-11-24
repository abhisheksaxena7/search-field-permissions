const fs = require('fs');

const packageXMLPath = 'package.xml';
const myModule = function () {
  const packageXML = fs.readFileSync(packageXMLPath).toString();
  const customFieldIndex = packageXML.search('CustomField');
  return console.log(test);
};

myModule();
