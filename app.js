const inquirer = require("inquirer");
// const fs = require("fs");
const generatePage = require("./src/page-template.js");
const { writeFile, copyFile } = require("./utils/generate-site");

const promptUser = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?",
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter your name!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "github",
      message: "Enter your Github Username",
      validate: (githubInput) => {
        if (githubInput) {
          return true;
        } else {
          console.log("Please enter your Github username!");
          return false;
        }
      },
    },
    {
      type: "confirm",
      name: "confirmAbout",
      message:
        "Would you like to enter some information about yourself for an 'About section? ",
      default: true,
    },
    {
      type: "input",
      name: "about",
      message: "Provide some information about yourself:",
      when: ({ confirmAbout }) => {
        if (confirmAbout) {
          return true;
        } else {
          return false;
        }
      },
    },
  ]);
};

const promptProject = (portfolioData) => {
  console.log(`
===============
Add a New Project
===============
`);

  // if there's no 'projects' array property, create one
  if (!portfolioData.projects) {
    portfolioData.projects = [];
  }

  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of your project?",
        validate: (projectName) => {
          if (projectName) {
            return true;
          } else {
            console.log("Please enter a name for your project!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "description",
        message: "Provide a description of the project (Required)",
        validate: (projectDescription) => {
          if (projectDescription) {
            return true;
          } else {
            console.log("Please enter a description for your project!");
            return false;
          }
        },
      },
      {
        type: "checkbox",
        name: "languages",
        message: "What did you build this project with? (Check all that apply)",
        choices: [
          "Javascript",
          "HTML",
          "CSS",
          "ES6",
          "jQuery",
          "Bootstrap",
          "Node",
        ],
      },
      {
        type: "input",
        name: "link",
        message: "Enter the Github link to your project. (Required)",
        validate: (projectLink) => {
          if (projectLink) {
            return true;
          } else {
            console.log("Please enter a name for your project!");
            return false;
          }
        },
      },
      {
        type: "confirm",
        name: "feature",
        message: "Would you like to feature this project?",
        default: false,
      },
      {
        type: "confirm",
        name: "confirmAddProject",
        message: "Would you like to enter another project?",
        default: false,
      },
    ])
    .then((projectData) => {
      portfolioData.projects.push(projectData);
      if (projectData.confirmAddProject) {
        return promptProject(portfolioData);
      } else {
        return portfolioData;
      }
    });
};

promptUser()
  .then(promptProject)
  .then((portfolioData) => {
    return generatePage(portfolioData);
  })
  .then((pageHTML) => {
    return writeFile(pageHTML);
  })
  .then((writeFileReponse) => {
    console.log(writeFileReponse);
    return copyFile();
  })
  .then((copyFileResponse) => {
    console.log(copyFileResponse);
  })
  .catch((err) => {
    console.log(err);
  });

// promptUser()
//   .then(promptProject)
//   .then((portfolioData) => {
//     const pageHTML = generatePage(portfolioData);
//     fs.writeFile("./dist/index.html", pageHTML, (err) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       console.log("Page created! Check out index.html to see the output!");

//       fs.copyFile("./src/style.css", "./dist/style.css", (err) => {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         console.log("Style sheet copied successfully!");
//       });
//     });
//   });
