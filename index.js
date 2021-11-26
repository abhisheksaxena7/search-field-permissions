const fs = require('fs');

const packageXMLPath = 'package.xml';
const myModule = function () {
  const packageXML = fs.readFileSync(packageXMLPath).toString();
  const customFieldIndex = packageXML.search('CustomField');
  if (customFieldIndex !== -1) {
    const indexOfClosingTypes = packageXML.indexOf('</types>', customFieldIndex);
    const filepreceedingindex = packageXML.substr('<types>', customFieldIndex); // package.xml before this index
    const findtypes = filepreceedingindex.split('<types>').pop(); // package.xml after <types> to customFieldIndex
    const indexofmember = findtypes.replace(/ *\<[\S]*?\>/g, ""); // Dispalys only fields
    const str = indexofmember.trim().split('\r\n');
    return console.log(str);
  }
  return console.log('Custom Fields are not part of the package.xml');
};

myModule();
