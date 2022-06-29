In this project we are using the [Nx build system](https://nx.dev/getting-started/intro)

/apps/ - folder to keep source code of [applications](https://nx.dev/structure/applications-and-libraries#applications-and-libraries)

/apps/consulting - source code of Quansight Consulting application
/apps/labs - source code of Quansight LCC application

/libs/ - [shared libraries](https://nx.dev/structure/grouping-libraries#sharing-libraries) used by the above applications
/tools - [workspace generators](https://nx.dev/generators/workspace-generators#workspace-generators)

/.vscode - Workspace settings as well as debugging and task configurations are stored at the root in a .vscode folder.
/.husky - Husky is a JavaScript package that allows you to run some code during various parts of your git workflow.
/.github - directory houses workflows, issue templates, pull request templates, funding information, and some other files specific to that project.
