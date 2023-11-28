import { TreeNode } from './file_system.js';

export class Shell {
  constructor(fileSystem, user = 'guest') {
    this.root = fileSystem;
    this.current_node = this.root;
    this.current_user = user;

    this.user_home_diretory = this.get_home_dir();
    // UI
    this.container_HTML = null;
    this.input_label_HTML = null;
    this.input_HTML = null;
    this.output_HTML = null;
  }
  read(input) {
    this.print_user_command(input); // print user_input
    this.input_HTML.value = ''; // clear user_input

    const [command, ...args] = input.split(' ');
    switch (command) {
      case 'ls':
        const printContent = (node, indent = 0) => {
          const indentation = '  '.repeat(indent);
          const nodeType = node.isDirectory ? '/' : '';
          this.print(`${indentation}${node.name}${nodeType}`);
          for (const child of node.children) {
            printContent(child, indent + 1);
          }
        };
        printContent(this.current_node);
        break;
      case 'pwd':
        this.print(`current: ${this.current_node.name}`);
        break;
      case 'mkdir':
        const newDirectoryName = args[0];
        const alreadyExists = this.current_node.children
          .filter((node) => node.isDirectory === true)
          .find((dir) => dir.name === newDirectoryName);
        //
        if (alreadyExists) {
          this.print(`'${newDirectoryName}' already exists.`);
        } else {
          this.current_node.addChild(
            new TreeNode(newDirectoryName, true, this.current_node)
          );
          // this.print(`Directory created: ${newDirectoryName}`);
        }

        break;
      case 'touch':
        const newFileName = args[0];
        const fileAlreadyExists = this.current_node.children
          .filter((node) => node.isDirectory === false)
          .find((file) => file.name === newFileName);
        //
        if (fileAlreadyExists) {
          this.print(`'${newFileName}' already exists.`);
        } else {
          this.current_node.addChild(
            new TreeNode(newFileName, false, this.current_node)
          );
          // this.print(`Directory created: ${newDirectoryName}`);
        }
        break;
      case 'rm':
        const itemNameToRemove = args[0];
        const indexToRemove = this.current_node.children.findIndex(
          (child) => child.name === itemNameToRemove
        );
        const itemFound = indexToRemove !== -1;

        if (itemFound) {
          this.current_node.children.splice(indexToRemove, 1);
          this.print(`'${itemNameToRemove}' removed.`);
        } else {
          this.print(`'${itemNameToRemove}' not found.`);
        }
        break;
      case 'cd':
        const invalidConditions = [
          !args[0],
          args[0] === 'error',
          args[0] === 'invalid',
          args[0] === 'invalid2',
        ];
        const target_invalid = invalidConditions.some((cond) => cond === true);
        const target_parent = args[0] === '..';
        const target_root = args[0] === '/';
        const target_user_home = args[0] === '~';

        if (target_invalid) {
          this.print("Invalid command. Type 'help' for a list of commands.");
        } else if (target_root) {
          this.current_node = this.root;
          this.print('go to root.');
        } else if (target_user_home) {
          this.current_node = this.user_home_diretory;
          this.print('go to home.');
        } else if (target_parent) {
          const isRoot = this.current_node === this.root;
          if (isRoot) {
            //
            this.print('already at Root');
            //
          } else {
            this.current_node = this.current_node.parent;
            this.print('go to parent.');
          }
        } else {
          // target__children
          const targetNodeName = args[0];
          const nodeFound = this.current_node.children
            .filter((node) => node.isDirectory === true)
            .find((node) => node.name === targetNodeName);
          this.current_node = nodeFound || this.current_node;
        }
        this.update_label();
        break;
      case 'clear':
      case 'cls':
        this.clear();
        break;
      case 'help':
        this.print(`
    Available Commands:
        ls          List files and directories
        cd ..       Move up one level
        cd [dir]    Change directory
        pwd         Print current directory
        mkdir       Create a new directory
        touch       Create a new file
        rm          Remove a file or directory
        clear       Clear the screen
        help        Display this help message`);
        break;
      default:
        this.print("Invalid command. Type 'help' for a list of commands.");
        break;
    }
  }
  print(text) {
    console.log(text);
    // HTML_print
    const output_record = document.createElement('pre');
    output_record.innerText = text;
    //
    this.output_HTML.appendChild(output_record);
    //
    this.update_label();
    this.scroll_bottom();
  }
  print_user_command(text) {
    const output_record = document.createElement('pre');
    output_record.classList.add('user_input');
    // output_record.innerText = `/${this.current_node.get_full_path()} ${text}`;
    output_record.innerText = `/${this.current_node.get_full_path()} ${text}`;
    this.output_HTML.appendChild(output_record);
    this.scroll_bottom();
  }

  get_home_dir() {
    const home = this.root.children.find((node) => node.name === 'home');
    return home.children.find((node) => node.name === this.current_user);
  }
  update_label() {
    this.input_label_HTML.innerText = `/${this.current_node.get_full_path()}`;
  }
  scroll_bottom() {
    this.container_HTML.scrollTo({
      top: this.output_HTML.scrollHeight,
    });
  }
  clear() {
    console.clear();
    this.output_HTML.innerHTML = '';
  }
}
