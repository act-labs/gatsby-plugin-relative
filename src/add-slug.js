const path = require("path");
const slash = require("slash");

function getDefaultRoots(){
  const cwd = process.cwd();
  const rt = [];
  rt.push(path.posix.join(slash(cwd), "/src/content"));
  rt.push(path.posix.join(slash(cwd), "/src/pages"))
  return rt
}

const defaultOptions = {
    types: ["Mdx", "MarkdownRemark"],
    endsWith: ["Yaml", "Json"],
    roots: null,
    trailingSlash: true
}

function endsWith(type, suffixes){
    if (!suffixes){
      return false;
    }
    for (const suffix of suffixes){
        if (type.endsWith(suffix)){
            return true
        }
    }
    return false;
}

function findFileNode({
  node,
  getNode
}) {
  // Find the file node.
  let fileNode = node;
  let whileCount = 0;

  while (fileNode.internal.type !== `File` && fileNode.parent && getNode(fileNode.parent) !== undefined && whileCount < 101) {
    fileNode = getNode(fileNode.parent);
    whileCount += 1;

    if (whileCount > 100) {
      console.log(`It looks like you have a node that's set its parent as itself`, fileNode);
    }
  }

  return fileNode;
}

function createFilePath({
  fileNode,
  trailingSlash = true,
  roots
}) {
  // Find the File node

  if (!fileNode) return undefined;

  for (const basePath of roots){
    const relativePath = path.posix.relative(slash(basePath), slash(fileNode.absolutePath));

    if (relativePath.startsWith("..")){
      continue
    }

    const _path$parse = path.parse(relativePath),
          _path$parse$dir = _path$parse.dir,
          dir = _path$parse$dir === void 0 ? `` : _path$parse$dir,
          name = _path$parse.name; 
       
  
    const parsedName = name === `index` ? `` : name;
    return path.posix.join(`/`, dir, parsedName, trailingSlash ? `/` : ``);
  }
  return undefined;

}

let defaultRoots;

function match(node, options=defaultOptions){
  const type = node.internal.type;
  return (Array.isArray(options.types) && options.types.indexOf(type) > -1) || endsWith(type, options.endsWith)
}

function addSlug({context:{ node, actions, getNode }, options, api}) {
  const {findFileNode, createFilePath, getDefaultRoots, match} = api || module.exports;
  options = Object.assign({}, defaultOptions, options); 

  if (match(node, options)) {
    const roots = options.roots || defaultRoots || (defaultRoots = getDefaultRoots());
    const fileNode = findFileNode({node, getNode });          
    const value = createFilePath({ fileNode, roots, trailingSlash: options.trailingSlash});

    if (value){     
      actions.createNodeField({
        // Name of the field you are adding
        name: "slug",
        node,
        value
      });
    }
  }
}

module.exports = {
  addSlug,
  findFileNode,
  createFilePath,
  getDefaultRoots,
  match
}
