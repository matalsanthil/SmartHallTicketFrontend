import { Component } from "react";
import { Modal } from "react-bootstrap";
import React from 'react';
import { backendUrlEnrollExam, backendUrlGetExams } from "../BckendURL";
import axios from 'axios';
import {Message} from 'primereact/message';



class StudentExam extends Component{

    constructor(){
        super()
        this.state = {
            exams : [],
            errorMessage: "",
            successMessage: "",
            userRole:sessionStorage.getItem("userRole"),
            subjectsModal:false,
            subjects : [],

            formValue:{
                examId:"",
                studentId:"",
            },

        }
    }

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

    componentWillMount(){
        this.getExams();
    }

    getExams = () =>{

        this.setState({errorMessage:""})
        axios.get(backendUrlGetExams+sessionStorage.getItem("branchId"))
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

    handleEnrollExam = (examId) => {
        const {formValue} = this.state;
        formValue.examId = examId;
        formValue.studentId = sessionStorage.getItem("userId");

        this.setState({errorMessage:"", successMessage:""});

        axios.post(backendUrlEnrollExam,formValue)
        .then(
            response => {
                console.log(response.data);
                this.setState({errorMessage : "", successMessage : response.data})
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

    createDateToString = (dateObj) => {
        let month = dateObj.getMonth()+1;
        if(month < 10) month = "0" + month;
        const day = String(dateObj.getDate() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const output = year  + '-'+ month  + '-' + day;
        return output;
    }


    render(){
        var exams = this.state.exams;
        const dateObj = new Date();
        const output = this.createDateToString(dateObj) + "T00:00";

        return(
            <>
            <br></br>
            <div class="table-responsive-md" style={{margin: 20}}>
                <table class="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Exam Name</th>
                        <th scope="col">Branch</th> 
                        <th scope="col">Exam Year</th>
                        <th scope="col">Subjects</th>
                        <th scope="col">Enroll</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {(exams.length > 0)?
                            exams.map(item => (
                                <tr key = {item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.branchName}</td>
                                    <td>{item.heldYear}</td>
                                    <td style={{textDecorationLine: "underline"}} onClick = {() => this.handleShowSubjects(item.id, item.subjects)}>View Subjects</td>
                                    <td>
                                    <button type = "button" className = "btn btn-success btn-sm" onClick = {() => this.handleEnrollExam(item.id)}>Enroll</button>
                                    </td>
                                </tr>
                            ))
                            :
                            <td colSpan={4}>{this.state.errorMessage}</td>}
                        
                    </tbody>
                </table>
            </div>

            {(this.state.successMessage.trim().length > 0 )?
                <div class="alert alert-success alert-dismissible fade show" role="alert" style = {{ position: "fixed", bottom : 0, margin: 10}}>
                     <Message severity = "successful" text = {this.state.successMessage} style = {{"color" : "green"}}></Message>
                     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                     </button>
                </div>:<></>
            }

            {(this.state.errorMessage.trim().length > 0 )?
                <div class="alert alert-danger alert-dismissible fade show" role="alert" style = {{position: "fixed", bottom : 0, margin: 10}}>
                     <Message severity = "error" text = {this.state.errorMessage} style = {{"color" : "red"}}></Message>
                     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                     </button>
                </div>:<></>
            }

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
                </Modal.Body>
                <Modal.Footer>
                    <button className = "btn btn-danger float-right" onClick = {this.handleCloseSubjects}>close</button>
                </Modal.Footer>

            </Modal>
            </>
        )
    
    }
}

export default StudentExam;