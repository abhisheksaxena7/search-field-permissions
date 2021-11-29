const fs = require('fs');
const colors = require('colors');
const xml2js = require('xml2js');
const util = require('util');

const packageXMLPath = 'package/mdapi/package.xml';
const AdminProfilePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';
let customFieldsArray = [];


/**
 * This method finds the customField in package.xml, puts them in an array and returns the array
 * @param {String} packageXML - The content of package.xml
 * @param {Integer} customFieldIndex - The index in the package.xml where CustomField tag is present
 * @returns The array of CustomFields in the package.xml
 */
const returnCustomFieldsArray = (packageXML) => xml2js.parseString(packageXML, (err, result) => {
  customFieldsArray = result.Package.types.filter((element) => element.name[0] === 'CustomField')[0].members;
  return customFieldsArray;
});

const verifyPermissionsInAdminProfile = () => {
  const fieldsWithoutReadAccess = [];
  customFieldsArray.forEach((customField) => {
    const AdminProfile = fs.readFileSync(AdminProfilePath).toString();
    const fieldIndex = AdminProfile.search(customField);
    if (fieldIndex !== -1) {
      const readableindex = AdminProfile.indexOf('</readable>', fieldIndex);
      const fileprecedingindex = AdminProfile.substr('<readable>', readableindex);
      const findtypes = fileprecedingindex.split('<readable>').pop();
      if (findtypes.match(true)) {
        return findtypes.match(true);
      }
      return fieldsWithoutReadAccess.push(customField);
    }
    return fieldsWithoutReadAccess.push(customField);
  });
  if (fieldsWithoutReadAccess.length > 0) {
    console.error(colors.red('The following fields do not have read permissions on the Admin profile. Update Admin profile to give them access.'));
    console.error(colors.red(fieldsWithoutReadAccess.toString()));
    return process.exit(1);
  }
  return console.log(colors.green('All customFields getting mentioned in this package have permission in the Admin profile.'));
};

const verifyCustomFieldPermissions = () => {
  try {
    const packageXML = fs.readFileSync(packageXMLPath).toString();
    const customFieldIndex = packageXML.search('CustomField');
    // If Custom fields are present in the package.xml
    if (customFieldIndex !== -1) {
      returnCustomFieldsArray(packageXML);
      console.log(customFieldsArray);
      return verifyPermissionsInAdminProfile(customFieldsArray);
    }
    return console.log(colors.yellow('Custom Fields are not part of the package.xml skipping execution'));
  } catch (error) {
    if (error.message === "ENOENT: no such file or directory, open 'package/mdapi/package.xml'") return console.log('Package is empty, skipping execution');
    throw error;
  }
};

verifyCustomFieldPermissions();
