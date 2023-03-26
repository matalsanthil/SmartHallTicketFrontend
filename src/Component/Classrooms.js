import { Component } from "react";
import { Modal } from "react-bootstrap";
import React from 'react';
import { backendUrlAddCLassRooms, backendUrlGetCLassRooms } from "../BckendURL";
import axios from 'axios';
import {Message} from 'primereact/message';


class Classrooms extends Component{

    constructor(){
        super()
        this.state = {
            classrooms : [],
            errorMessage: "",
            successMessage: "",
            userRole:sessionStorage.getItem("userRole"),
            showModal:false,
            redirectBooking:false,

            formValue:{
                wing:"",
                number:0,
                floor:0,
                capacity:0,
            },
    
            formErrorMessage:{
                wing:"",
                number:"",
                floor:"",
                capacity:"",
            },
    
            formValid :{
                wing:false,
                number:false,
                floor:false,
                capacity:false,
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
        this.getClassrooms();
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

            case "wing":
                const wingRegex = /^[A-Z]$/;
                if(value === ""){
                    formValidationError.wing = "Field Required";
                    formValid.wing=false;
                }
                else if(!value.match(wingRegex)){
                    formValidationError.wing = "Enter valid wing name";
                    formValid.wing = false;
                }

                else{
                    formValidationError.wing="";
                    formValid.wing=true;
                }
                break;
            
                case "floor":
                    if(value === ""){
                        formValidationError.floor = "Field Required";
                        formValid.floor=false;
                    }    
                    else{
                        formValidationError.floor="";
                        formValid.floor=true;
                    }
                    break;

                case "number":
                    if(value === ""){
                        formValidationError.number = "Field Required";
                        formValid.number=false;
                    }    
                    else{
                        formValidationError.number="";
                        formValid.number=true;
                    }
                    break;
                
                case "capacity":
                    if(value === ""){
                        formValidationError.capacity = "Field Required";
                        formValid.capacity=false;
                    }    
                    else{
                        formValidationError.capacity="";
                        formValid.capacity=true;
                    }
                    break;

            }

            formValid.ButtonActive = formValid.wing && formValid.number && formValid.floor && formValid.capacity;

            this.setState({
                formErrorMessage:formValidationError,
                formValid: formValid,
                successMessage: "",
                errorMessage: ""
            })
        }

    addClassroom = () => {
        const {formValue} = this.state;
        this.setState({errorMessage:"", successMessage:""});

        axios.post(backendUrlAddCLassRooms,formValue)
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

    getClassrooms = () =>{

        this.setState({errorMessage:""})
        axios.get(backendUrlGetCLassRooms)
        .then(
            response =>{
                console.log(response.data)
                this.setState({classrooms : response.data})
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
        var classrooms = this.state.classrooms;

        return(
            <>
            <br></br>
            <div class = "row justify-content-end">
                <div class = "col-md-2 ms-auto justify-content-end">
                <button class="btn btn-primary btn-rounded btn-md my-0 waves-effect waves-light" style={{margin: 20}} type="submit" onClick = {() => this.handleShow()}>Add CLassroom</button>
                </div>
            </div>
            <div class="table-responsive-md" style={{margin: 20}}>
                <table class="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Wing</th>
                        <th scope="col">Floor</th>
                        <th scope="col">Room Number</th>
                        <th scope="col">Capacity</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {(classrooms.length > 0)?
                            classrooms.map(item => (
                                <tr>
                                    <td>{item.wing}</td>
                                    <td>{item.floor}</td>
                                    <td>{item.wing + " - " + item.floor + "0" + item.number}</td>
                                    <td>{item.capacity}</td>
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
                    <Modal.Title>Add Classroom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div class="form-content">
                    <div class="form-items">
                        <p>Fill in the data below.</p>
                        <form class="requires-validation" autocomplete="off" novalidate>
    
                            <div class="col-md-12">
                                <input class="form-control" type="text" name="wing" placeholder="Enter Wing" onChange = {this.handlechange} required/>
                                <Message severity = "error" text = {this.state.formErrorMessage.wing} style = {{"color" : "red","max-width": 400}}></Message>
                            </div>
                            <div class="col-md-12">
                                <input class="form-control" type="number" name="floor" placeholder="Enter Floor Number" onChange = {this.handlechange} required/>
                                <Message severity = "error" text = {this.state.formErrorMessage.floor} style = {{"color" : "red","max-width": 400}}></Message>
                            </div>
                            <div class="col-md-12">
                                <input class="form-control" type="number" name="number" placeholder="Enter Room Number" onChange = {this.handlechange} required/>
                                <Message severity = "error" text = {this.state.formErrorMessage.number} style = {{"color" : "red","max-width": 400}}></Message>
                            </div>
                            <div class="col-md-12">
                                <input class="form-control" type="number" name="capacity" placeholder="Enter Capacity" onChange = {this.handlechange} required/>
                                <Message severity = "error" text = {this.state.formErrorMessage.capacity} style = {{"color" : "red","max-width": 400}}></Message>
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
                    <button type = "button" className = "btn btn-success float-right" style={{marginLeft: 10}} disabled= {!this.state.formValid.ButtonActive} onClick = {this.addClassroom}>Add</button>
                </Modal.Footer>

            </Modal>
            </>
        )
    
    }

}

export default Classrooms;