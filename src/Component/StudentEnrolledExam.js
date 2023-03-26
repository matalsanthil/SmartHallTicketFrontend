import { Component } from "react";
import { Modal } from "react-bootstrap";
import React, {useRef} from 'react';
import { backendUrlgetStudent, backendUrlstudentExam } from "../BckendURL";
import axios from 'axios';
import {Message} from 'primereact/message';
import qrcode from "qrcode";
import JsPDF from 'jspdf';
import { PDFExport } from '@progress/kendo-react-pdf';


class StudentEnrolledExams extends Component{

    constructor(){
        super()
        this.state = {
            exams : [],
            errorMessage: "",
            successMessage: "",
            userRole:sessionStorage.getItem("userRole"),
            subjectsModal:false,
            showModal:false,
            subjects : [],

            formValue:{
                examId:"",
                studentId:"",
            },
            fname : "",
            lname : "",
            aadharNumber : "",
            dob : "",
            contactNo : "",
            emailId : "",
            address : "",
            examName: "",
            branchName:"",
            heldYear:"",
            qrcode : "",
        }
    }

    generateQRCpde = async () =>{
        console.log(this.state.aadharNumber);
        const image = await qrcode.toDataURL(this.state.aadharNumber.toString())
        this.setState({qrcode : image});
    }

    handleClose = () => {
        
        this.setState({showModal:false})
    }
    handleShow = (examId, examSubjects, examName, branchName, healdYear) => {
        const value = examId;
        const name = "examId";
        this.setState({
            showModal:true,
            subjects : examSubjects,
            examName: examName,
            branchName: branchName,
            heldYear:healdYear
        })
        this.generateQRCpde();
        
    }

    handleShowSubjects = (examId, examSubjects) => {
        const value = examId;
        const name = "examId";
        this.setState({
            subjectsModal:true,
            subjects : examSubjects,
        })
    }

    handleCloseSubjects = () => {
        this.componentWillMount()
        this.setState({subjectsModal:false})
    }

    componentWillMount(){
        this.getExams();
        this.getStudent();
    }

    getExams = () =>{

        this.setState({errorMessage:""})
        axios.get(backendUrlstudentExam+sessionStorage.getItem("userId"))
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

    getStudent = () =>{

        this.setState({errorMessage:""})
        axios.get(backendUrlgetStudent+sessionStorage.getItem("userId"))
        .then(
            response =>{
                console.log(response.data)
                this.setState({
                    fname : response.data.fname,
                    lname : response.data.lname,
                    aadharNumber : response.data.aadharNumber,
                    dob : response.data.dob,
                    contactNo : response.data.contactNo,
                    emailId : response.data.emailId,
                    address : response.data.address,
                })
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

    createDateToString = (dateObj) => {
        let month = dateObj.getMonth()+1;
        if(month < 10) month = "0" + month;
        const day = String(dateObj.getDate() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const output = year  + '-'+ month  + '-' + day;
        return output;
    }

    generatePDF = () => {

        const report = new JsPDF('portrait','mm','a4');
        report.html(document.querySelector('#hallTicket')).then(() => {
            report.save('hallticket.pdf');
        });
    }

    exportPDF = () => {
        this.resume.save();
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
                        <th scope="col">View Hallticket</th>
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
                                    <button type = "button" className = "btn btn-success btn-sm" onClick = {() => this.handleShow(item.id, item.subjects, item.name, item.branchName, item.heldYear)}>View Hallticket</button>
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


            <Modal id = "hallTicket" classname = "modal" show = {this.state.showModal} onHide = {this.handleClose} size = "xl" animationType = {"fade"}>
                <Modal.Header>
                    <Modal.Title>Exam Hallticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <PDFExport paperSize={'A3'}
                    fileName="HallTicket.pdf"
                    title=""
                    subject=""
                    keywords=""
                    landscape="true"
                    ref={(r) => this.resume = r}>

                <div class="container-fluid" id = "hallticket" style={{backgroundColor: "white"}}>
                        <div class="row">
                            <div class="col-12 mt-3">
                                <div class="card" style={{color : "#454545"}}>
                                    <div class="card-horizontal">
                                        <div class="img-square-wrapper">
                                            <img class="package-image" src={this.state.qrcode} style= {{margin : 10, border:1}} alt="Card image cap"/>    
                                        </div>
                                        <div class="card-body">
                                            <h4 class="card-title">Hall Ticket</h4>
                                            <hr></hr>
                                            <div className="row">    
                                                <h6 className = "font-weight-bold">Name : <span style={{color: "grey"}}>{this.state.fname + " " + this.state.lname}</span></h6>
                                            </div>
                                            <div className="row">
                                                <h6 className = "font-weight-bold" style={{display: "inline"}}>Branch : <span style={{color: "grey"}}>{this.state.branchName}</span></h6>
                                                
                                            </div>
                                            <div className="row">
                                                <h6 className = "col col-md-6 font-weight-bold">Aadhar Number : <span style={{color: "grey"}}>{
                                                    this.state.aadharNumber.toString().substring(0,4) + "-" +
                                                    this.state.aadharNumber.toString().substring(4,8) + "-" +
                                                    this.state.aadharNumber.toString().substring(8,12)
                                                }</span></h6>
                                                <h6 className = "col col-md-6 font-weight-bold">Date of Birth : <span style={{color: "grey"}}>{this.state.dob.substring(0,10)}</span></h6>
                                            </div>
                                            <div className="row">
                                                <h6 className = "col col-md-6 font-weight-bold">Contact Number : <span style={{color: "grey"}}>{"+91 "+this.state.contactNo}</span></h6>
                                                <h6 className = "col col-md-6 font-weight-bold">Email Id : <span style={{color: "grey"}}>{this.state.emailId}</span></h6>
                                            </div>
                                            <br/>
                                            <div className="row">
                                                <h6 className = "col col-md-6 font-weight-bold">Exam Name : <span style={{color: "grey"}}>{this.state.examName}</span></h6>
                                                
                                                <h6 className = "col col-md-6 font-weight-bold">Year : <span style={{color: "grey"}}>{this.state.heldYear}</span></h6>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class = "row">
                            <div class="table-responsive-md" style={{margin: 10}}>
                                <table class="table table-striped table-hover">
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
                        </div>
                    </div>
                    </PDFExport>
                 
                
                </Modal.Body>
                <Modal.Footer>
                    <button className = "btn btn-danger float-right" onClick = {this.handleClose}>close</button>
                    <button type = "button" className = "btn btn-success float-right" style={{marginLeft: 10}} onClick = {this.exportPDF}>Print</button>
                </Modal.Footer>

            </Modal>
            </>
        )
    
    }
}

export default StudentEnrolledExams;