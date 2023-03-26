import { Component } from "react";
import { Modal } from "react-bootstrap";
import React from 'react';
import { backendUrlAddExam, backendUrlAddExamsSubject, backendUrlAllocateClassrooms, backendUrlGetBranches, backendUrlGetExams, backendUrlGetSubjects } from "../BckendURL";
import axios from 'axios';
import {Message} from 'primereact/message';


class Exams extends Component{

    constructor(){
        super()
        this.state = {
            exams : [],
            errorMessage: "",
            successMessage: "",
            userRole:sessionStorage.getItem("userRole"),
            showModal:false,
            subjectsModal:false,
            studentsModal:false,
            subjects : [],
            allSubjects:[],
            branches:[],
            students:[],
            examId : "",
            formValue:{
                name:"",
                healdYear:"",
                branchId:0,
            },
    
            formErrorMessage:{
                name:"",
                healdYear:"",
                branchId:"",
            },
    
            formValid :{
                name:false,
                healdYear:false,
                branchId:false,
                ButtonActive:false
            },

            subjectFormValue:{
                examId:0,
                subjectId:0,
                dateOfExam:""
            },
    
            subjectErrorMessage:{
                examId:"",
                subjectId:"",
                dateOfExam:""
            },
    
            subjectFormValid :{
                examId:false,
                subjectId:false,
                dateOfExam:false,
                ButtonActive:false
            }


        }
    }

    handleClose = () => {
        this.componentWillMount()
        this.setState({showModal:false})
    }
    handleShow = () => {this.setState({showModal:true})}

    handleShowSubjects = (examId, examSubjects) => {
        const value = examId;
        const name = "examId";
        console.log(name,value);
        const {subjectFormValue} = this.state;
        this.setState({
            subjectsModal:true,
            subjects : examSubjects,
            subjectFormValue : {...subjectFormValue,[name] : value}
        })
    }

    handleCloseSubjects = () => {
        this.componentWillMount()
        this.setState({subjectsModal:false})
    }

    handleShowStudent = (examId, examStudent) => {
        const value = examId;
        const name = "examId";
        console.log(name,value);
        this.setState({
            studentsModal :true,
            students : examStudent,
            examId : examId,            
        })
    }

    handleCloseStudent = () => {
        this.componentWillMount()
        this.setState({studentsModal :false})
    }

    componentWillMount(){
        this.getExams();
        this.getAllSubjects();
        this.getBranches();
    }

    handlechange = event => {
        
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(name,value);
        const {formValue} = this.state;
        this.setState({formValue : {...formValue,[name] : value} } );
        this.validateData(name,value);
    };

    handleselect = event => {
        
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(name,value);
        const {subjectFormValue} = this.state;
        this.setState({subjectFormValue : {...subjectFormValue,[name] : value} } );
        this.validateSubjectData(name,value);
    };

    validateSubjectData = (fieldname,value) => {
        let formValidationError = this.state.subjectErrorMessage;
        let formValid = this.state.subjectFormValid;

        switch(fieldname){

            case "subjectId":
                if(value === "default"){
                    formValidationError.subjectId = "Field Required";
                    formValid.subjectId=false;
                }
                else{
                    formValidationError.subjectId="";
                    formValid.subjectId=true;
                }
                break;
            
                case "dateOfExam":
                    if(value === ""){
                        formValidationError.dateOfExam = "Field Required";
                        formValid.dateOfExam=false;
                    }    
                    else{
                        formValidationError.dateOfExam="";
                        formValid.dateOfExam=true;
                    }
                    break;

            }

            formValid.ButtonActive = formValid.subjectId && formValid.dateOfExam;

            this.setState({
                subjectErrorMessage:formValidationError,
                subjectFormValid : formValid,
                successMessage: "",
                errorMessage: ""
            })
        }

    addSubject = () => {
        console.log(this.state.subjectFormValue)
    }

    createDateToString = (dateObj) => {
        let month = dateObj.getMonth()+1;
        if(month < 10) month = "0" + month;
        const day = String(dateObj.getDate() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const output = year  + '-'+ month  + '-' + day;
        return output;
    }

    validateData = (fieldname,value) => {
        let formValidationError = this.state.formErrorMessage;
        let formValid = this.state.formValid;

        switch(fieldname){

            case "branchId":
                if(value === "default"){
                    formValidationError.branchId = "Field Required";
                    formValid.branchId=false;
                }      
                else{
                    formValidationError.branchId="";
                    formValid.branchId=true;
                }
                break;
            
            case "heldYear":
                const yearRegex = /^[2-9][0-9][2-9][3-9]$/;
                if(!value.match(yearRegex)){
                    formValidationError.heldYear = "Please Enter Year in Valid Format ! Ex. 2023";
                    formValid.heldYear=false;
                }  
                else{
                    formValidationError.heldYear="";
                    formValid.heldYear=true;
                }
                break;

            case "name":
                if(value === ""){
                    formValidationError.name = "Field Required";
                    formValid.name=false;
                }    
                else{
                    formValidationError.name="";
                    formValid.name=true;
                }
                break;

            }

            formValid.ButtonActive = formValid.name && formValid.heldYear && formValid.branchId;

            this.setState({
                formErrorMessage:formValidationError,
                formValid: formValid,
                successMessage: "",
                errorMessage: ""
            })
        }

    addExam = () => {
        const {formValue} = this.state;
        this.setState({errorMessage:"", successMessage:""});

        axios.post(backendUrlAddExam,formValue)
        .then(
            response => {
                console.log(response.data);
                this.setState({errorMessage : "", successMessage : response.data})
                this.handleClose()
            }).catch(error => {
                if(error.response) {
                    console.log(error.response.data);
                    this.setState({errorMessage : error.response.data.message, successMessage : ""})
                }
                else{
                    this.setState({errorMessage : "Please Check Your Details or Try Again Later", successMessage : ""})
                }
                
            });
    }

    addSubject = () => {
        const {subjectFormValue} = this.state;
        this.setState({errorMessage:"", successMessage:""});

        axios.post(backendUrlAddExamsSubject,subjectFormValue)
        .then(
            response => {
                console.log(response.data);
                this.setState({errorMessage : "", successMessage : response.data})
                this.handleCloseSubjects();
            }).catch(error => {
                if(error.response) {
                    console.log(error.response.data);
                    this.setState({errorMessage : error.response.data.message, successMessage : ""})
                }
                else{
                    this.setState({errorMessage : "Please Check Your Details or Try Again Later", successMessage : ""})
                }
                
            });
    }

    allocateClassrooms = () => {
        this.setState({errorMessage:"", successMessage:""});

        axios.post(backendUrlAllocateClassrooms + this.state.examId)
        .then(
            response => {
                console.log(response.data);
                this.setState({errorMessage : "", successMessage : response.data})
                this.handleCloseStudent();
            }).catch(error => {
                if(error.response) {
                    console.log(error.response.data);
                    this.setState({errorMessage : error.response.data.message, successMessage : ""})
                }
                else{
                    this.setState({errorMessage : "Please Check Your Details or Try Again Later", successMessage : ""})
                }
                
            });
    }

    getExams = () =>{

        this.setState({errorMessage:""})
        axios.get(backendUrlGetExams)
        .then(
            response =>{
                console.log(response.data)
                this.setState({exams : response.data})
            }
        ).catch(error => {
            if(error.response) {
                console.log(error.response.data);
                this.setState({errorMessage : error.response.data.message})
            }
            else{
                this.setState({errorMessage : "Server Not Available, Please Try Again Later"})
            }
            
        });
    }

    getAllSubjects = () =>{

        this.setState({errorMessage:""})
        axios.get(backendUrlGetSubjects)
        .then(
            response =>{
                console.log(response.data)
                this.setState({allSubjects : response.data})
            }
        ).catch(error => {
            if(error.response) {
                console.log(error.response.data);
                this.setState({errorMessage : error.response.data.message})
            }
            else{
                this.setState({errorMessage : "Server Not Available, Please Try Again Later"})
            }
            
        });
    }

    getBranches = () =>{

        this.setState({errorMessage:""})
        axios.get(backendUrlGetBranches)
        .then(
            response =>{
                console.log(response.data)
                this.setState({branches : response.data})
            }
        ).catch(error => {
            if(error.response) {
                console.log(error.response.data);
                this.setState({errorMessage : "No Records to show!"})
            }
            else{
                this.setState({errorMessage : "Server Not Available, Please Try Again Later"})
            }
            
        });
    }

    isAlreadyAddedSub = (sub) =>{
        const alreadyAddedSub = this.state.subjects;
        var i;
        for (i = 0; i < alreadyAddedSub.length; i++) {
            if (alreadyAddedSub[i].code == sub.code) {
                return false;
            }
        }
        return true;
    }

    render(){
        var exams = this.state.exams;
        const dateObj = new Date();
        const output = this.createDateToString(dateObj) + "T00:00";

        return(
            <>
            <br></br>
            <div class = "row justify-content-end">
                <div class = "col-md-2 ms-auto justify-content-end">
                <button class="btn btn-primary btn-rounded btn-md my-0 waves-effect waves-light" style={{margin: 20}} type="submit" onClick = {() => this.handleShow()}>Add Exam</button>
                </div>
            </div>
            <div class="table-responsive-md" style={{margin: 20}}>
                <table class="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Exam Name</th>
                        <th scope="col">Branch</th> 
                        <th scope="col">Exam Year</th>
                        <th scope="col">Subjects</th>
                        <th scope="col">Enrolled Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {(exams.length > 0)?
                            exams.map(item => (
                                <tr key = {item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.branchName}</td>
                                    <td>{item.heldYear}</td>
                                    <td style={{textDecorationLine: "underline"}} onClick = {() => this.handleShowSubjects(item.id, item.subjects)}>View/Add Subjects</td>
                                    <td style={{textDecorationLine: "underline"}} onClick = {() => this.handleShowStudent(item.id, item.students)}>View Students</td>
                                </tr>
                            ))
                            :
                            <td colSpan={4}>{this.state.errorMessage}</td>}
                        
                    </tbody>
                </table>
            </div>

            {(this.state.successMessage.trim().length > 0 )?
                <div class="alert alert-success alert-dismissible fade show" role="alert" style = {{"max-width": 500, position: "fixed", bottom : 0, margin: 10}}>
                     <Message severity = "successful" text = {this.state.successMessage} style = {{"color" : "green","max-width": 400}}></Message>
                     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                     </button>
                </div>:<></>
            }

            <Modal classname = "modal" show = {this.state.showModal} onHide = {this.handleClose} size = "lg" animationType = {"fade"}>
                <Modal.Header>
                    <Modal.Title>Add Exam</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div class="form-content">
                    <div class="form-items">
                        <p>Fill in the data below.</p>
                        <form class="requires-validation" autocomplete="off" novalidate>

                        <div class="col-md-12">
                                <input class="form-control" type="text" name="heldYear" placeholder="Enter Exam Year" onChange = {this.handlechange} required/>
                                <Message severity = "error" text = {this.state.formErrorMessage.heldYear} style = {{"color" : "red","max-width": 400}}></Message>
                            </div>
    
                            <div class="col-md-12">
                                <input class="form-control" type="text" name="name" placeholder="Enter Exam Name" onChange = {this.handlechange} required/>
                                <Message severity = "error" text = {this.state.formErrorMessage.name} style = {{"color" : "red","max-width": 400}}></Message>
                            </div>
                            <div class="col-md-12">
                            <select class="form-control" id="branch" name = "branchId" onChange = {this.handlechange}>
                                <option value="default">--- Select Branch ---</option>
                                
                                {(this.state.branches.length > 0)?
                                    this.state.branches
                                    .map(item => (
                                        
                                        <option value={item.id}>{item.name}</option>

                                    ))
                                    :null
                                }
                            </select>
                                <Message severity = "error" text = {this.state.formErrorMessage.branchId} style = {{"color" : "red","max-width": 400}}></Message>
                            </div>
                            

                            <br/>

                            {(this.state.errorMessage.trim().length > 0 )?
                                <div class="alert alert-danger" role="alert" style = {{"max-width": 500}}>
                                    {this.state.errorMessage}
                                </div>:<></>
                            }

                        </form>
                    </div>  
                    </div>                  

                </Modal.Body>
                <Modal.Footer>
                    <button className = "btn btn-danger float-right" onClick = {this.handleClose}>close</button>
                    <button type = "button" className = "btn btn-success float-right" style={{marginLeft: 10}} disabled= {!this.state.formValid.ButtonActive} onClick = {this.addExam}>Add</button>
                </Modal.Footer>

            </Modal>

            <Modal classname = "modal" show = {this.state.subjectsModal} onHide = {this.handleCloseSubjects} size = "xl" animationType = {"fade"}>
                <Modal.Header>
                    <Modal.Title>Number of Subjects {this.state.subjects.length}</Modal.Title>
                </Modal.Header>
                <Modal.Body>                
                    <div class="table-responsive-md" style={{margin: 20}}>
                        <table class="table table-dark table-striped table-hover">
                            <thead>
                                <tr>
                                <th scope="col">Subject Code</th>
                                <th scope="col">Subject Name</th>
                                <th scope="col">Date Of Exam</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                {(this.state.subjects.length > 0)?
                                    this.state.subjects.map(item => (
                                        <tr key = {item.id}>
                                            <td>{item.code}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                {item.dateOfExam.toString().split("T")[0]
                                                + " "
                                                + item.dateOfExam.toString().split("T")[1].split(":")[0]
                                                + ":"
                                                + item.dateOfExam.toString().split("T")[1].split(":")[1]
                                                + " IST"
                                                }
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <td colSpan={3}>Subjects Not Added Yet !</td>}
                                
                            </tbody>
                        </table>
                    </div>
                    <hr></hr>
                    <p>Fill in the data below to add subject to the exam.</p>
                        <form class="requires-validation" autocomplete="off">
                            <div class="row">
                            <div class="col-md-6">
                            <select class="form-control" id="subjets" name = "subjectId" onChange = {this.handleselect}>
                                <option value="default">--- Select Subject ---</option>
                                
                                {(this.state.allSubjects.length > 0)?
                                    this.state.allSubjects
                                    .filter(item =>(
                                        this.isAlreadyAddedSub(item)
                                    ))
                                    .map(item => (
                                        
                                        <option value={item.id}>{item.code + " - " + item.name}</option>

                                    ))
                                    :null
                                }
                            </select>
                            <Message severity = "error" text = {this.state.subjectErrorMessage.subjectId} style = {{"color" : "red","max-width": 400}}></Message>
                            </div>
                            <br></br>
                            <div class="col-md-6">
                            <input class="form-control" type="datetime-local" name="dateOfExam" placeholder="Enter Subject Code" onChange = {this.handleselect} min = {output} required/>
                            <Message severity = "error" text = {this.state.subjectErrorMessage.dateOfExam} style = {{"color" : "red","max-width": 400}}></Message>
                            </div>
                            </div>  
                        </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className = "btn btn-danger float-right" onClick = {this.handleCloseSubjects}>close</button>
                    <button type = "button" className = "btn btn-success float-right" style={{marginLeft: 10}} disabled= {!this.state.subjectFormValid.ButtonActive} onClick = {this.addSubject}>Add Subject</button>            
                </Modal.Footer>

            </Modal>

            <Modal classname = "modal" show = {this.state.studentsModal} onHide = {this.handleCloseStudent} size = "xl" animationType = {"fade"}>
                <Modal.Header>
                    <Modal.Title>Number of Students Enrolled {this.state.students.length}</Modal.Title>
                </Modal.Header>
                <Modal.Body>                
                    <div class="table-responsive-md" style={{margin: 20}}>
                        <table class="table table-dark table-striped table-hover">
                            <thead>
                                <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Branch</th>
                                <th scope="col">Contact No.</th>
                                <th scope="col">Email Id</th>
                                <th scope="col">Aadhar Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                {(this.state.students.length > 0)?
                                    this.state.students.map(item => (
                                        <tr key = {item.id}>
                                            <td>{item.fname + " " + item.lname}</td>
                                            <td>{item.branch}</td>
                                            <td>{"+91 " + item.contactNo}</td>
                                            <td>{item.emailId}</td>
                                            <td>{
                                                    item.aadharNumber.toString().substring(0,4) + "-" +
                                                    item.aadharNumber.toString().substring(4,8) + "-" +
                                                    item.aadharNumber.toString().substring(8,12)
                                                }
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <td colSpan={5}>Students Not Enrolled Yet !</td>}
                                
                            </tbody>
                        </table>
                    </div>
                    
                </Modal.Body>
                <Modal.Footer>
                    <button className = "btn btn-danger float-right" onClick = {this.handleCloseStudent}>close</button>
                    <button type = "button" className = "btn btn-success float-right" style={{marginLeft: 10}} onClick = {this.allocateClassrooms}>Allocate Clasrooms</button>            
                </Modal.Footer>

            </Modal>
            </>
        )
    
    }
}

export default Exams;