# PK-Yonge-App
A web-based application that allows students at [PK Yonge Developmental Research School](http://pkyonge.ufl.edu/) (in Gainesville, FL) to practice for their end-of-course exams.
This application was created for the Introduction to Software Engineering (CEN3031) class at the University of Florida, using the MEAN stack.

Spring 2016 CEN3031-10b group:
- Travis Atkins [@Atkins945](https://github.com/Atkins945)
- James Bocinsky [@jbocinsky](https://github.com/jbocinsky) project contact
- Brandon Duong [@Bduong30](https://github.com/Bduong30) project contact
- Kevin Marin [@KMarin](https://github.com/KMarin)
- Michael Rodriguez [@microdr](https://github.com/microdr)

Fall 2015 CEN3031-9C group:
- Bailey Anderson [@baileyanderson](https://github.com/baileyanderson)
- Cody Fitzpatrick [@CodyFitzpatrick](https://github.com/CodyFitzpatrick)
- Nicola Frachesen [@Nicola37](https://github.com/Nicola37)
- Guilain Huyghes-Despointes [@ghDespointes](https://github.com/ghDespointes)
- Sara Lichtenstein [@saralich](https://github.com/saralich)
- Terry Philippe [@tjphilippe](https://github.com/tjphilippe)
- Xiaoxi Zheng [@XiaoxiZheng](https://github.com/XiaoxiZheng)

## Deployment

#### Site URL: https://still-mountain-43055.herokuapp.com
Our app is deployed through HEROKU. Deployment information can be found [here](https://devcenter.heroku.com/articles/deploying-nodejs).

### Running the App Locally
- Install all necessary packages and libraries by following [this installation guide](https://docs.google.com/document/d/1B7aqptx0jsWHLqm7W9BT1oKHYNCKkvwtjjUtsj6C-ks/edit?pli=1) 
- After cloning the remote repository to a local repository on your computer and navigating to the directory in which the app contents are located, you can run the app by using Grunt, "The Javascript Task Runner". Please see the below terminal commands that detail this process. The repository only needs to be cloned once, during the installation of the app.

```sh
$ git clone https://github.com/CEN3031-10b/PKY
$ cd PKY
$ grunt --force

```

### Updating the database connection
- In the file `PK-Yonge-App\config\env\local-development.js`
- Change lines 6 to 14 to be your respective login credentials and mongoLab information

## Features completed
* Taking an exam    
    * multiple choice, multiple select, fill in the blank (numerical or text) question types
    * formula sheet, scientific calculator, and notes in draggable modals
* View previous exam attempts
	* Student
	  * View all previous attempts, see which standards are associated with each question   
	* Admin
	  * View and search through all student attempts
	  * Delete student attempts
* Create/edit exams panel for teachers
    * Exams
      * Time allotted, avaialable to students, number of allowed attempts properties of an exam
    * Questions can have:
      * multiple standards
      * a picture
      * MathJax equations for question content and answers
* EOC standards
   * Student
      * view all standards, and see instructor's notes for specific standards
   * Admin
      * create, read, update, and delete standards
* Equation rendering
   * Adapted angular directive to render latex code between two $ signs in math-jax tagged elements

## TODO list
* Implement more EOC question types
	* Drag and drop
 	* Grid
	* More types  [here](http://www.fsassessments.org/wp-content/uploads/2015/11/FSA-Practice-Test-Quick-Guide_FINAL.pdf)
* 	Add question image to edit-exams panel and single exam attempt views
*   Approve user sign up only with valid PKY email
*  	Allow teacher to edit students attempts
*  	Allow for hard deadline of timer (exam property)
*  	MathJax vs Katex
    * Decide which equation rendering library to use. Katex is faster, but is less feature complete than MathJax.
* 	Randomize question and answer option for an exam
* 	Mathquill equation response for fill in the blank questions
* 	Add process environment variables for lost password email retrieval to heroku
* 	Update information menu content

## Known issues
* see github issues

## Screenshots 
The landing page.
![Homepage](modules/core/client/img/screenshots/sp16/landingPage?raw=true)

Selecting a practice exam.
![Homepage](modules/core/client/img/screenshots/sp16/selectExamPage?raw=true)

Taking a practice exam.
![Homepage](modules/core/client/img/screenshots/sp16/takeExamPage?raw=true)

Viewing a graded exam attempt.
![Homepage](modules/core/client/img/screenshots/sp16/viewExamAttempt?raw=true)

Student view of EOC standards.
![Homepage](modules/core/client/img/screenshots/sp16/studentViewStandards?raw=true)

Admin create/edit exams page.
![Homepage](modules/core/client/img/screenshots/sp16/adminEditExams?raw=true)

Admin view of student exam attempts.
![Homepage](modules/core/client/img/screenshots/sp16/adminViewStudentAttempts?raw=true)

## Credits

* [Scientific calculator used in FSA EOC exams](http://www.fsassessments.org/?s=calculator+download&submit=&rtree=&cat=)
* [trNgGrid](https://github.com/MoonStorm/trNgGrid)
* [MathJax](https://www.mathjax.org/)
* [Katex](https://github.com/Khan/KaTeX)
* [Mathquill](http://mathquill.com/)
* [MEAN Stack](http://mean.io/#!/) - MongoDB, Express, Angular, and Node
* [AngularJS] - HTML enhanced for web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [MongoDB](https://www.mongodb.org/) - NoSQL Database 
* [jQuery] - For basic Javascript functionalities
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
