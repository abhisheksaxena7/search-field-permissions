const fs = require('fs');
const os = require('os');

const packageXMLPath = 'package.xml';

const returnCustomFieldsArray = (packageXML, customFieldIndex) => {
  const fileprecedingindex = packageXML.substr('<types>', customFieldIndex); // package.xml before this index
  const findtypes = fileprecedingindex.split('<types>').pop(); // package.xml after <types> to customFieldIndex
  const indexofmember = findtypes.replace(/ *\<[\S]*?\>/g, ""); // Dispalys only fields
  return indexofmember.trim().split(os.EOL);
};

const searchInAdminProfile = (customFieldsArray) => {
  return customFieldsArray.forEach((customField) => {
    const AdminProfilePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';
    const AdminProfile = fs.readFileSync(AdminProfilePath).toString();
    const findfield = AdminProfile.includes(customField);
    const fieldIndex = AdminProfile.search(customField);
    if (fieldIndex !== -1) {
      const readableindex = AdminProfile.indexOf('</readable>', fieldIndex);
      const fileprecedingindex = AdminProfile.substr('<readable>', readableindex);
      const findtypes = fileprecedingindex.split('<readable>').pop();
      const str = findtypes.match(true);
      return str;
    }
    else {
      return console.log('Custom Field should have Visibility access for Admin Profile');
    }
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
