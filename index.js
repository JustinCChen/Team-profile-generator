const generateHtml = require('./src/generateHtml');

const fs = require('fs');
const inquirer = require('inquirer');


const Manager = require('./lib/Manager');
const Employee = require('./lib/Employee');
const Intern = require('./lib/Intern')

const teamArray =[];

function addManager(){
   return inquirer.prompt([
        {
            type : 'input',
            name : 'name',
            message:'Who is the manager of this team?'
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the manager's ID.",
            validate:inputNum => {
                if (isNaN(inputNum)){
                    console.log("Please enter manager's ID");
                    return false;
                }else{
                    return true;
                }
            }
        },
        {
            type: 'input',
            name: 'email',
            message:"Please enter the manger's email.",
            validate: email => {
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                if (valid){
                    return true;
                }else {
                    console.log('Please enter valid email')
                    return false;
                }
            }

        },
        {
            type: 'input',
            name: 'officeNumber',
            message: "Please enter the manager's office number",
            validate:inputNum => {
                if (isNaN(inputNum)){
                    console.log("Please enter manager's ID");
                    return false;
                }else{
                    return true;
                }
            }
        },
    ])
    .then((managerData) => {
        const {name ,id ,email ,officeNumber} = managerData;
        const manager = new Manager(name , id, email, officeNumber);

        teamArray.push(manager)
        console.log(manager);
    })
}

function addEmployee (){
    return inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: "Please choose your employee's role",
            choices: ['Engineer','Intern']
        },
        {
            type: 'input',
            name: 'name',
            message: "What's the name of the employee?",
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the employee's ID?",
            validate: idInput => {
                if(isNaN(idInput)){
                    console.log("Please enter the employee's ID")
                    return false
                }else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            name: 'github',
            message:"Please enter the employee's github username?",
            when: (input) => input.role === 'Engineer',
        },
        {
            type: 'input',
            name: 'email',
            message: "Please enter the employee's email.",
            validate: email => {
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                if (valid) {
                    return true;
                } else {
                    console.log ('Please enter an email!')
                    return false; 
                }
            }
        },
        {
            type: 'input',
            name: 'school',
            message:"Please enter the intern's shcool",
            when: (input) => input.role ==='Intern',
        },
        {
            type: 'confirm',
            name: 'confirmAddEmployee',
            message: 'Would you like to add more team members?',
        }

    ])
    .then(employeeData => {
        let {role,name,id,github,email,school} = employeeData;
        let employee;
        if (role ==="Engineer"){
            employee = new Employee(role,name,id,github,email);
            console.log(employee);
        }else if (role === "Intern"){
            employee = new Intern(role,name,id,school,email);
            console.log(employee);
        }
        teamArray.push(employeeData);

        if (confirmAddEmployee) {
            return addEmployee(teamArray);
          } else {
            writeFile();
          }
    }
)}

function writeFile() {
    fs.writeFile('./dist/team.html',generateHtml(teamArray), err =>{
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Your team profile has been successfully created! Please check out the team.html")
        }
    }
)}

addManager()
    .then(addEmployee)
    .then(teamArray =>{
        return generateHtml(teamArray);
    })
    .then(pageHTML => {
        return writeFile(pageHTML);
      })
    .catch(err=>{
        console.log(err);
    })
