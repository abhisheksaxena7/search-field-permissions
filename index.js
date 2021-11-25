const fs = require('fs');

const packageXMLPath = 'package.xml';
const myModule = function () {
  const packageXML = fs.readFileSync(packageXMLPath).toString();
  const customFieldIndex = packageXML.search('CustomField');
  if (customFieldIndex !== -1) {
    const indexOfClosingTypes = packageXML.indexOf('</types>', customFieldIndex);
    const indexOfTypes = packageXML.LastIndexOf('<types>', customFieldIndex);
  }
  return console.log('Custom Fields are not part of the package.xml');
};

myModule();
