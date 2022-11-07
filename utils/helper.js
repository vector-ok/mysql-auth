const RolePermission = require('../models/rolepermission');
const Permission = require('../models/permission');

class Helper {
  constructor() {}

  checkPermission(roleId, permName) {
    return new Promise((resolve, reject) => {
      Permission.findOne({
        where: {
          permName: permName,
        },
      })
        .then((perm) => {
          RolePermission.findOne({
            where: {
              role_Id: role_Id,
              perm_id: perm_id,
            },
          });
        })
        .then((rolePermission) => {
          if (rolePermission) {
            resolve(rolePermission);
          } else {
            reject({ message: 'Access Denied!' });
          }
        });
    });
  }
}

module.exports = Helper;
