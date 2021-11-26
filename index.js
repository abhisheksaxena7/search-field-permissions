const fs = require('fs');
const os = require('os');

const packageXMLPath = 'package.xml';

const returnCustomFieldsArray = (packageXML, customFieldIndex) => {
  const filepreceedingindex = packageXML.substr('<types>', customFieldIndex); // package.xml before this index
  const findtypes = filepreceedingindex.split('<types>').pop(); // package.xml after <types> to customFieldIndex
  const indexofmember = findtypes.replace(/ *\<[\S]*?\>/g, ""); // Dispalys only fields
  return indexofmember.trim().split(os.EOL);
};

const searchInAdminProfile = (customFieldsArray) => {
  return customFieldsArray.forEach((customField) => {
    console.log('customField = ', customField);
  });
};

const searchForFieldPermissions = () => {
  const packageXML = fs.readFileSync(packageXMLPath).toString();
  const customFieldIndex = packageXML.search('CustomField');
  let customFieldsArray = [];
  // If Custom fields are there in the package.xml
  if (customFieldIndex !== -1) {
    customFieldsArray = returnCustomFieldsArray(packageXML, customFieldIndex);
    return searchInAdminProfile(customFieldsArray);
  }

  return console.log('Custom Fields are not part of the package.xml');
};

searchForFieldPermissions();
