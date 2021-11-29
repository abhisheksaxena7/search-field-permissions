const fs = require('fs');
const colors = require('colors');
const xml2js = require('xml2js');

const PACKAGEXMLPATH = 'package/mdapi/package.xml';
const ADMINPROFILEPATH = 'force-app/main/default/profiles/Admin.profile-meta.xml';
let customFieldsArray = [];

/**
 * This method parses the package.xml as Javascript Object,
 * finds the customFields in it, puts them in an array and returns the array
 * @param {String} packageXML - The content of package.xml
 * @returns The array of CustomFields in the package.xml
 */
const returnCustomFieldsArray = (packageXML) => xml2js
  .parseString(packageXML, (err, packageXMLObj) => {
    customFieldsArray = packageXMLObj.Package.types.filter((element) => element.name[0] === 'CustomField')[0].members;
    return customFieldsArray;
  });

/**
 * This method verifies if the customFields have permissions in the Admin profile
 * @returns
 */
const verifyPermissionsInAdminProfile = () => {
  const fieldsWithoutReadAccess = [];
  const adminProfile = fs.readFileSync(ADMINPROFILEPATH).toString();
  xml2js.parseString(adminProfile, (err, adminProfileObj) => {
    customFieldsArray.forEach((customField) => {
      const fieldPermissionBlock = adminProfileObj
        .Profile.fieldPermissions.find((obj) => obj.field[0] === customField);
      if (!fieldPermissionBlock || !fieldPermissionBlock.readable || fieldPermissionBlock.readable[0] === 'false') {
        fieldsWithoutReadAccess.push(customField);
      }
      return fieldsWithoutReadAccess;
    });
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
    const packageXML = fs.readFileSync(PACKAGEXMLPATH).toString();
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
