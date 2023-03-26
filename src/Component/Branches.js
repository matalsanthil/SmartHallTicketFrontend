import { Component } from "react";
import { Modal } from "react-bootstrap";
import React from 'react';
import { backendUrlAddBranches, backendUrlAddCLassRooms, backendUrlGetBranches } from "../BckendURL";
import axios from 'axios';
import {Message} from 'primereact/message';

class Branches extends Component{

    constructor(){
        super()
        this.state = {
            branches : [],
            errorMessage: "",
            successMessage: "",
            userRole:sessionStorage.getItem("userRole"),
            showModal:false,
            redirectBooking:false,

            formValue:{
                name:"",
            },
    
            formErrorMessage:{
                name:"",
            },
    
            formValid :{
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

    validateData = (fieldname,value) => {
        let formValidationError = this.state.formErrorMessage;
        let formValid = this.state.formValid;

        switch(fieldname){
            
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

            formValid.ButtonActive = formValid.name;

            this.setState({
                formErrorMessage:formValidationError,
                formValid: formValid,
                successMessage: "",
                errorMessage: ""
            })
        }

        addBranch = () => {
            const {formValue} = this.state;
            this.setState({errorMessage:"", successMessage:""});
    
            axios.post(backendUrlAddBranches,formValue)
            .then(
                response => {
                    console.log(response.data);
                    this.setState({errorMessage : "", successMessage : response.data})
                    this.handleClose()
                }).catch(error => {
                    if(error.response) {
                        this.setState({errorMessage : error.response.data.message, successMessage : ""})
                    }
                    else{
                        this.setState({errorMessage : "Please Check Your Details or Try Again Later", successMessage : ""})
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

    render(){
        var branches = this.state.branches;

        return(
            <>
            <br></br>
            <div class = "row justify-content-end">
                <div class = "col-md-2 ms-auto justify-content-end">
                <button class="btn btn-primary btn-rounded btn-md my-0 waves-effect waves-light" style={{margin: 20}} type="submit" onClick = {() => this.handleShow()}>Add Branch</button>
                </div>
            </div>
            <div class="table-responsive-md" style={{margin: 20}}>
                <table class="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Branch Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {(branches.length > 0)?
                            branches.map(item => (
                                <tr>
                                    <td>{"I00"+item.id}</td>
                                    <td>{item.name}</td>
                                </tr>
                            ))
                            :
                            <tr>
                            <td colSpan={2}>{this.state.errorMessage}</td>
                            </tr>
                        }
                            
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
                    <Modal.Title>Add Branch</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div class="form-content">
                    <div class="form-items">
                        <p>Fill in the data below.</p>
                        <form class="requires-validation" autocomplete="off" novalidate>
    
                            <div class="col-md-12">
                                <input class="form-control" type="text" name="name" placeholder="Enter Branch Name" onChange = {this.handlechange} required/>
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
                    <button type = "button" className = "btn btn-success float-right" style={{marginLeft: 10}} disabled= {!this.state.formValid.ButtonActive} onClick = {this.addBranch}>Add</button>
                </Modal.Footer>

            </Modal>
            </>
        )
    
    }

}

export default Branches;