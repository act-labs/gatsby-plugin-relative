
const {addSlug} = require("./add-slug");
exports.onCreateNode = function(context, options){ 
    addSlug({context, options});
}


  