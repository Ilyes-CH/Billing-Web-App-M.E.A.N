const Service = require('../models/services')

/**@params {Array} [id,id,...] */
async function findServicesByIds(ids) {
    try {
        const docs = await Service.find({ _id: { $in: ids } })
        if (docs && docs.length > 0) {
            return true
        } else {
            return false
        }
    }catch(e){
      console.error("\x1b[31m*******************Error: \x1b[0m", e);
        return false
    }
}
module.exports = findServicesByIds