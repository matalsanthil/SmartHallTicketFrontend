import { Component } from "react";
import { Modal } from "react-bootstrap";
import React from 'react';
import { backendUrlAddSubjects, backendUrlGetSubjects } from "../BckendURL";
import axios from 'axios';
import {Message} from 'primereact/message';


class Subjects extends Component{

    constructor(){
        super()
        this.state = {
            subjects : [],
            errorMessage: "",
            successMessage: "",
            userRole:sessionStorage.getItem("userRole"),
            showModal:false,
            redirectBooking:false,

            formValue:{
                code:"",
                name:"",
            },
    
            formErrorMessage:{
                code:"",
                name:"",
            },
    
            formValid :{
                code:false,
                name:false,
                ButtonActive:false
            }
        }
    }

    handleClose = () => {
        this.componentWillMount()
        this.setState({showModal:false})
    }
    handleShow = () => {this.setState({showModal:true})}

    componentWillMount(){
        this.getSubjects();
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

    validateData = (fieldname,value) => {
        let formValidationError = this.state.formErrorMessage;
        let formValid = this.state.formValid;

        switch(fieldname){

            case "code":
                const wingRegex = /^[A-Z]{1,5}[0-9]{3,4}$/;
                if(!value.match(wingRegex)){
                    formValidationError.code = "Code Should be in valid format ! Eg. IT101";
                    formValid.code=false;
                }
                else{
                    formValidationError.code="";
                    formValid.code=true;
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

            formValid.ButtonActive = formValid.code && formValid.name;

            this.setState({
                formErrorMessage:formValidationError,
                formValid: formValid,
                successMessage: "",
                errorMessage: ""
            })
        }

    addSubject = () => {
        const {formValue} = this.state;
        this.setState({errorMessage:"", successMessage:""});

        axios.post(backendUrlAddSubjects,formValue)
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

    getSubjects = () =>{

        this.setState({errorMessage:""})
        axios.get(backendUrlGetSubjects)
        .then(
            response =>{
                console.log(response.data)
                this.setState({subjects : response.data})
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

    render(){
        var subjects = this.state.subjects;

        return(
            <>
            <br></br>
            <div class = "row justify-content-end">
                <div class = "col-md-2 ms-auto justify-content-end">
                <button class="btn btn-primary btn-rounded btn-md my-0 waves-effect waves-light" style={{margin: 20}} type="submit" onClick = {() => this.handleShow()}>Add Subject</button>
                </div>
            </div>
            <div class="table-responsive-md" style={{margin: 20}}>
                <table class="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Subject Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {(subjects.length > 0)?
                            subjects.map(item => (
                                <tr>
                                    <td>{item.code}</td>
                                    <td>{item.name}</td>
                                </tr>
                            ))
                            :
                            <td colSpan={2}>{this.state.errorMessage}</td>}
                        
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
                    <Modal.Title>Add Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div class="form-content">
                    <div class="form-items">
                        <p>Fill in the data below.</p>
                        <form class="requires-validation" autocomplete="off" novalidate>
    
                            <div class="col-md-12">
                                <input class="form-control" type="text" name="code" placeholder="Enter Subject Code" onChange = {this.handlechange} required/>
                                <Message severity = "error" text = {this.state.formErrorMessage.code} style = {{"color" : "red","max-width": 400}}></Message>
                            </div>
                            <div class="col-md-12">
                                <input class="form-control" type="text" name="name" placeholder="Enter Subject Name" onChange = {this.handlechange} required/>
                                <Message severity = "error" text = {this.state.formErrorMessage.name} style = {{"color" : "red","max-width": 400}}></Message>
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
                    <button type = "button" className = "btn btn-success float-right" style={{marginLeft: 10}} disabled= {!this.state.formValid.ButtonActive} onClick = {this.addSubject}>Add</button>
                </Modal.Footer>

            </Modal>
            </>
        )
    
    }

}

export default Subjects;