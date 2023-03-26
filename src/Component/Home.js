import { Component } from "react";
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { backendUrlGetClassroom } from "../BckendURL";
import axios from 'axios';
import {Message} from 'primereact/message';

class Home extends Component{

    constructor(){
        super()
        this.state = {
            isSearched : false,
            aadharQuery : "",
            errorMessage : "Please scan QR code on Hall Ticket or Enter your aadhar number in search box",
            fname : "",
            lname : "",
            aadharNumber : "",
            dob : "",
            contactNo : "",
            emailId : "",
            dateOfExam : "",
            branchName:"",
            classRoom:"",
            scannedMessage : "",
            scannedErrorMessage: "",
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.getClassroom();
    }

    getClassroom = () =>{
        
        this.setState({errorMessage:"", successMessage:""});

        axios.get(backendUrlGetClassroom + this.state.aadharQuery)
        .then(
            response => {
                console.log(response.data);
                this.setState({
                    errorMessage : "", 
                    fname : response.data.fname,
                    lname : response.data.lname,
                    aadharNumber : response.data.aadharNumber,
                    dob : response.data.dob,
                    contactNo: response.data.contactNo,
                    emailId: response.data.emailId,
                    branchName : response.data.branchName,
                    dateOfExam : response.data.dateOfExam,
                    classRoom : response.data.classroom,
                    isSearched : true,
                    scannedMessage: "",
                    scannedErrorMessage: "", 
                })
            }).catch(error => {
                if(error.response) {
                    console.log(error.response.data);
                    this.setState({
                        errorMessage : error.response.data.message,
                        isSearched : false, 
                        scannedErrorMessage: "Try Again!", 
                        scannedMessage : "" 
                    })
                }
                else{
                    this.setState({errorMessage : "Please Check Your Details or Try Again Later",
                        isSearched : false,
                        scannedErrorMessage: "Try Again!", 
                        scannedMessage : ""  
                    })
                }
                
            });
    }

    handlechange = event => {
        
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(name,value);
        this.setState({aadharQuery : value});
    };

   
    webcamError = (error) => {
        if (error) {
            console.log(error);
        }
    }

    webcamScan = (result) => {
        if (result) {
            console.log(result.text);
            this.setState({
                aadharQuery : result.text,
                scannedMessage : "Please wait Fetching classroom for you !"
            });
            this.getClassroom();
        }
    }

    render(){
        
             
        return(
            <>
            <br/>
            <div class="row" style={{"width" : "100%"}}>

            <div class="col-md-8 mb-4 offset-md-3"  >

                <form class="form-inline md-form ">
                <input class="form-control mr-sm-2 mr-auto" type="text" placeholder="Search" style={{"width":"70%","marginLeft":10}} onChange = {this.handlechange} aria-label="Search"/>
                <button class="btn btn-primary btn-rounded btn-sm my-0 waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Search</button>
                </form>

            </div>
            </div>
            <hr class="my-4" style = {{"color":"grey"}}></hr>
            <br></br>

            <div className = "row" style={{ margin: 20}}>
            
                <div className = "col col-md-3">
                    <div>
                        <div class="card text-grey bg-light" style={{height : "auto"}}>
                            <div class="card-body">
                            <QrReader
                                delay = {300}
                                onError = {this.webcamError}
                                onResult = {this.webcamScan}
                                legacyMode = {false}
                                facingMode = {"user"}
                            >
                            </QrReader>                        
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isSearched?
                <div class="col col-md-8 mt-3">
                    <div class="card" style={{color : "#454545"}}>
                        <div class="card-horizontal">
                            <div class="card-body">
                                <h4 class="card-title">Student Details</h4>
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
                                    <h6 className = "col col-md-6 font-weight-bold">Exam Date : <span style={{color: "grey"}}>{this.state.dateOfExam.substring(0,10)}</span></h6>
                                </div> 
                            </div>
                            <div class="card-footer">
                                <h5 className = "font-weight-bold">Allocated Classroom : </h5>
                                <h4 className = "text-primary font-weight-bold">{this.state.classRoom}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                :<div class=" col col-md-8 alert alert-danger center-block" role="alert" style={{"max-height" : "4em"}}>
                    {this.state.errorMessage}
                </div>
                }

                
            </div>
            {(this.state.scannedMessage.trim().length > 0 )?
                <div class="alert alert-success alert-dismissible fade show" role="alert" style = {{"max-width": 500, position: "fixed", bottom : 0, margin: 10}}>
                     <Message severity = "successful" text = {this.state.scannedMessage} style = {{"color" : "green","max-width": 400}}></Message>
                </div>:<></>
            }
            {(this.state.scannedErrorMessage.trim().length > 0 )?
                <div class="alert alert-danger alert-dismissible fade show" role="alert" style = {{"max-width": 500, position: "fixed", bottom : 0, margin: 10}}>
                     <Message severity = "error" text = {this.state.scannedErrorMessage} style = {{"color" : "red","max-width": 400}}></Message>
                </div>:<></>
            }
            </>
        );
    }
}

export default Home;