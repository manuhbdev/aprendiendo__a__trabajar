class TreeNode {
  constructor(name, isDirectory, parent = null) {
    this.name = name;
    this.isDirectory = isDirectory;
    this.parent = parent;
    this.children = [];
  }
  addChild(childNode) {
    childNode.parent = this;
    this.children.push(childNode);
  }
}

function create_file_system() {
  const root = new TreeNode('Root', true);
  // create-nodes
  const bin__directory = new TreeNode('bin', true); // User Binaries
  const sbin__directory = new TreeNode('sbin', true); // System Binaries
  const etc__directory = new TreeNode('etc', true); // Configuration file
  const dev__directory = new TreeNode('dev', true); // Device Files
  const proc__directory = new TreeNode('proc', true); // Process Information
  const var__directory = new TreeNode('var', true); // Variable Files
  const tmp__directory = new TreeNode('tmp', true); // Temporary Files
  const usr__directory = new TreeNode('usr', true); // User Programs
  const home__directory = new TreeNode('home', true); // Home Directories
  const boot__directory = new TreeNode('boot', true); // Boot Loader Files
  const lib__directory = new TreeNode('lib', true); // System Libraries
  const opt__directory = new TreeNode('opt', true); // Optional Add-On file
  const mnt__directory = new TreeNode('mnt', true); // Mount Directory
  const media__directory = new TreeNode('media', true); // Removable Devices
  const srv__directory = new TreeNode('srv', true); // Service Data

  // connect-nodes
  root.addChild(bin__directory);
  root.addChild(sbin__directory);
  root.addChild(etc__directory);
  root.addChild(dev__directory);
  root.addChild(proc__directory);
  root.addChild(var__directory);
  root.addChild(tmp__directory);
  root.addChild(usr__directory);
  root.addChild(home__directory);
  root.addChild(boot__directory);
  root.addChild(lib__directory);
  root.addChild(opt__directory);
  root.addChild(mnt__directory);
  root.addChild(media__directory);
  root.addChild(srv__directory);
  //
  home__directory.addChild(create_vfs_user('guest'));

  return root;
}
//
function create_vfs_user(username) {
  const user_directory = new TreeNode(username, true);
  // create-nodes
  const desktop__directory = new TreeNode('Desktop', true);
  const documents__directory = new TreeNode('Documents', true);
  const downloads__directory = new TreeNode('Downloads', true);
  const pictures__directory = new TreeNode('Pictures', true);
  const code__directory = new TreeNode('Code', true);
  // connect-nodes
  user_directory.addChild(desktop__directory);
  user_directory.addChild(documents__directory);
  user_directory.addChild(downloads__directory);
  user_directory.addChild(pictures__directory);
  user_directory.addChild(code__directory);
  return user_directory;
}

export const file_system = create_file_system();
