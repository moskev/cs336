/*
 Calvin College CS 336 Course - Lab 02
 Author: Moses Mangunrahardja
 Date: 9/16/2016
 */

//Exercise 2.1

//Create an object of Person
function person(name, birthDate, greeting){
    this.name = name;
    this.birthDate = birthDate;
    this.greeting = greeting;
    this.friendList = [];
}

//Mutator for changing the person's name
person.prototype.changeName = function(newName){
    this.name = newName;
}

//Calculate the age of the person based on their birthdate
person.prototype.getAge = function() {
    var today = new Date();
    var birthDate = new Date(this.birthDate);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

//Add new friend for the person
person.prototype.addFriend = function(aPerson){
    this.friendList.push(aPerson);
}

//Test create a person
var myName = new person("Musa","1993/12/03", "I am a person.");

//Test name change
myName.changeName("Moses");

//Test for adding friends
var f1 = new person("John", "2000/01/02", "I am a professor");
var f2 = new person("Doe", "1950/02/01", "Hello");
myName.addFriend(f1);
myName.addFriend(f2);

//Test for calculating the age
var age = myName.getAge();
var age2 = f1.getAge();

//Test to display greeting
var greeting = myName.greeting;
var greeting2 = f1.greeting;

//Display result for me
console.log("My name is: "+ myName.name + ". I am "+ age + " years old. " + greeting + '\n' + "Here are my friends: ");
for(i=0; i<myName.friendList.length; i++){
    console.log(myName.friendList[i].name);
}

//Display result for my friend
console.log("My name is: "+ f1.name + ". I am "+ age2 + " years old. " + greeting2 + '\n' + "Here are my friends: ");
for(i=0; i<f1.friendList.length; i++){
    console.log(f1.friendList[i].name);
}


//Exercise 2.2

//The object Student inherits person
function student(name, birthdate, greeting, major){
    person.call(this, name, birthdate,greeting);
    this.major = major;
}
student.prototype = Object.create(person.prototype);

student.prototype.printGreeting =  function(){
    console.log(this.greeting + "My name is " + this.name + " and I am studying "+ this.major);
}

//Test create student and print greetings
var studentA = new student("Kevin", "1994/01/03", "I am a student. ", "Information Systems");
studentA.printGreeting();


//Test if studentA is instance of student and person
if (studentA instanceof student)[
    console.log("studentA is an instance of student")
]

if (studentA instanceof person)[
    console.log("studentA is an instance of person")
]
