import { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Studentlogin from './Studentlogin';
import StudentRegister from "./StudentRegister";
import Teacherlogin from "./Teacherlogin";
import TeacherRegister from "./TeacherRegister";
import Home from "./Home";
import CreateCourse from "./CreateCourse";
import Classrooms from "./Classrooms";
import Branches from "./Branches";
import Subjects from "./Subjects";
import Exams from "./Exams";
import StudentExam from "./StudentExams";
import StudentEnrolledExams from "./StudentEnrolledExam";

class Navigation extends Component{

    constructor(props) {
        super(props);
        this.state = {
          logged_userId: sessionStorage.getItem("userId"),
          logged_userRole: sessionStorage.getItem("userRole"),
          logged_userName:sessionStorage.getItem("userName"),
          logged_out: false
        };
      }

      logout = () => {
        
        sessionStorage.clear();
        this.setState({ logged_out: true });
        window.location.reload();
        window.location.href = "/";
      };
    
    render(){


        let navData = <div class="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul class="navbar-nav">
                        <li class="nav-item">
                            <Link class="nav-link" to="/">Home <span class="sr-only">(current)</span></Link>
                        </li>
                        {(this.state.logged_userRole === "student")?
                            <><li class="nav-item">
                                <Link class="nav-link" to="/Student Exams">Exams</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" to="/Enrolled Exams">Enrolled Exams</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" to="/" onClick = {this.logout}>Log Out</Link>
                            </li>
                            </>
                        
                        :null}
                        {(this.state.logged_userRole === "teacher")?
                            <>
                            <li class="nav-item">
                            <Link class="nav-link" to="/admin exams">Exams</Link>
                            </li>
                            <li class="nav-item">
                            <Link class="nav-link" to="/subjects">Subjects</Link>
                            </li>
                            <li class="nav-item">
                            <Link class="nav-link" to="/branch">Branch</Link>
                            </li>
                            <li class="nav-item">
                            <Link class="nav-link" to="/classrooms">CLassrooms</Link>
                            </li>
                            <li class="nav-item">
                            <Link class="nav-link" to="/" onClick = {this.logout}>Log Out</Link>
                            </li></>
                        
                        :null}
                        
                        {(this.state.logged_userRole)?null:<><li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Sign in
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <Link class="dropdown-item" to="/student login">As Student</Link>
                            <Link class="dropdown-item" to="/teacher login">As Admin</Link>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Sign Up
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <Link class="dropdown-item" to="/student register">As Student</Link>
                            <Link class="dropdown-item" to="/teacher register">As Admin</Link>
                            </div>
                        </li></>}
                        </ul>
                    </div>;
        return(
            <div>
            <Router>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
            
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    {navData}

                    {(this.state.logged_userName)?<span class="nav-item ml-auto">Welcome {this.state.logged_userName}</span>:null}                    
                
                </nav>
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/student login" component= {Studentlogin}></Route>
                    <Route exact path="/student register" component= {StudentRegister}></Route>
                    <Route exact path="/teacher login" component= {Teacherlogin}></Route>
                    <Route exact path="/teacher register" component= {TeacherRegister}></Route>
                    <Route exact path="/classrooms" component= {Classrooms}></Route>
                    <Route exact path="/branch" component= {Branches}></Route>
                    <Route exact path="/subjects" component= {Subjects}></Route>
                    <Route exact path="/admin exams" component= {Exams}></Route>   
                    <Route exact path="/Student Exams" component= {StudentExam}></Route> 
                    <Route exact path="/Enrolled Exams" component= {StudentEnrolledExams}></Route> 
                      
                </Switch>
            </Router>
            </div>
        )
    }
}

export default Navigation;