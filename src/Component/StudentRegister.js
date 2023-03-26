import { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom.css'
import axios from 'axios';
import {Message} from 'primereact/message';
import { backendUrlGetBranches, backendUrlstudentRegister } from "../BckendURL";

class StudentRegister extends Component {

    state = {
        successMessage: "",
        errorMessage: "",
        branches : [],
        
        formValue:{
            fname : "",
            lname : "",
            aadharNumber : "",
            dob : "",
            contactNo : "",
            emailId : "",
            address : "",
            password : "",
            branchId : ""
        },

        formErrorMessage:{
            fname : "",
            lname : "",
            aadharNumber : "",
            dob : "",
            contactNo : "",
            emailId : "",
            address : "",
            password : "",
            branchId : ""
        },

        formValid :{
            fname : false,
            lname : false,
            aadharNumber : false,
            dob : false,
            contactNo : false,
            emailId : false,
            address : false,
            password : false,
            branchId : false,
            ButtonActive:false
        },

        placeholderFname : ""

    }

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

            case "lname":
                const lnameregex= /^(((?<!^)\s(?!$)|[-a-zA-Z])*)$/;
                if(value === ""){
                    formValidationError.lname = "Field Required";
                    formValid.lname = false;
                }
                else if(!value.match(lnameregex)){
                    formValidationError.lname = "Invalid Last Name";
                    formValid.lname = false;
                }else{
                    formValidationError.lname = "";
                    formValid.lname = true;
                }
                break;
            case "fname":
                const userNameregex= /^(((?<!^)\s(?!$)|[-a-zA-Z])*)$/;
                if(value === ""){
                    formValidationError.fname = "Field Required";
                    formValid.fname = false;
                }
                else if(!value.match(userNameregex)){
                    formValidationError.fname = "Invalid First Name";
                    formValid.fname = false;
                }else{
                    formValidationError.fname = "";
                    formValid.fname = true;
                }
                break;

            case "aadharNumber":
                const aadharNumberRegex= /^[0-9]{12}$/;
                if(value === ""){
                    formValidationError.aadharNumber = "Field Required";
                    formValid.aadharNumber = false;
                }
                else if(!value.match(aadharNumberRegex)){
                    formValidationError.aadharNumber = "Invalid Aadhar Number";
                    formValid.aadharNumber = false;
                }else{
                    formValidationError.aadharNumber = "";
                    formValid.aadharNumber = true;
                }
                break;

            case "emailId":
                const emailIdregex= /^[a-zA-Z0-9._]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if(value === ""){
                    formValidationError.emailId = "Field Required";
                    formValid.emailId= false;
                }
                else if(!value.match(emailIdregex)){
                    formValidationError.emailId = "Please enter valid email id";
                    formValid.emailId = false;
                }else{
                    formValidationError.emailId = "";
                    formValid.emailId = true;
                }
                break;

            case "contactNo":
                const contactNumberRegex = /^[6-9][0-9]{9}$/;
                if(value === ""){
                    formValidationError.contactNo = "Field Required";
                    formValid.contactNo = false;
                }
                else if(!value.match(contactNumberRegex)){
                    formValidationError.contactNo = "Invalid Mobile Number";
                    formValid.contactNo = false;
                }
                else{
                    formValidationError.contactNo = "";
                    formValid.contactNo = true;
                }
                break;
            
            case "dob":
                if(value === ""){
                    formValidationError.dob = "Field Required";
                    formValid.dob = false;
                }
                else{
                    formValidationError.dob = "";
                    formValid.dob = true;
                }
                break;

            case "address":
                if(value === ""){
                    formValidationError.address = "Field Required";
                    formValid.address = false;
                }
                else{
                    formValidationError.address = "";
                    formValid.address = true;
                }
                break;

            case "branchId":
                if(value === "default"){
                    formValidationError.branchId = "Field Required";
                    formValid.branchId = false;
                }
                else{
                    formValidationError.branchId = "";
                    formValid.branchId = true;
                }
                break;

            case "password":
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if(value === ""){
                    formValidationError.password = "Field Required";
                    formValid.password=false;
                }
                else if(!value.match(passwordRegex)){
                    formValidationError.password = "password must contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character, minimum length is 8";
                    formValid.password = false;
                }

                else{
                    formValidationError.password="";
                    formValid.password=true;
                }
                break;
        }

        formValid.ButtonActive = formValid.contactNo 
                                && formValid.password 
                                && formValid.fname 
                                && formValid.lname
                                && formValid.emailId
                                && formValid.aadharNumber
                                && formValid.address
                                && formValid.branchId
                                && formValid.dob;

        this.setState({
            formErrorMessage:formValidationError,
            formValid: formValid,
            successMessage: "",
            errorMessage: ""
        })
    }
    handleSubmit = event =>{
        event.preventDefault();
        this.register();
        
    }

    register = () => {
        const {formValue} = this.state;
        this.setState({errorMessage:"", successMessage:""});

        axios.post(backendUrlstudentRegister,formValue)
        .then(
            response => {
                formValue.fname = ""
                formValue.lname = ""
                formValue.aadharNumber = ""
                formValue.address = ""
                formValue.dob = ""
                formValue.contactNo = ""
                formValue.emailId = ""
                formValue.address = ""
                formValue.password = ""
                formValue.branchId = "default"

                console.log(response.data);
                this.setState({errorMessage : "", successMessage : response.data, formValue : formValue})
                
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

        return(

            <div class="form-body">
            <div class="row">
                <div class="form-holder">
                    <div class="form-content">
                        <div class="form-items">
                            <h3>Register as Student</h3>
                            <p>Fill in the data below.</p>
                            <form class="requires-validation" novalidate>
                                <div class="row">
                                    <div class="col-md-6">
                                    <input class="form-control" type="text" name="fname" placeholder="Enter your first name" onChange = {this.handlechange} value = {this.state.formValue.fname} required/>
                                    <Message severity = "error" text = {this.state.formErrorMessage.fname} style = {{"color" : "red", "max-width": 400}}></Message>
                                    </div>
            
                                    <div class="col-md-6">
                                        <input class="form-control" type="text" name="lname" placeholder="Enter your last name"onChange = {this.handlechange} value = {this.state.formValue.lname} required/>
                                        <Message severity = "error" text = {this.state.formErrorMessage.lname} style = {{"color" : "red", "max-width": 400}}></Message>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <input class="form-control" type="number" name="aadharNumber" placeholder="Enter Aadhar Number" value={this.state.formValue.aadharNumber} onChange = {this.handlechange} required/>
                                        <Message severity = "error" text = {this.state.formErrorMessage.aadharNumber} style = {{"color" : "red", "max-width": 400}}></Message>
                                    </div>

                                    <div class="col-md-6">
                                        <input class="form-control" name="dob" value={this.state.formValue.dob} onChange = {this.handlechange} type="date" placeholder="MM/DD/YYYY" required/>
                                        <Message severity = "error" text = {this.state.formErrorMessage.dob} style = {{"color" : "red", "max-width": 400}}></Message> 
                                    </div>
                                 </div>


                                <div class="row">
                                    <div class="col-md-6">
                                        <input class="form-control" type="number" name="contactNo" value={this.state.formValue.contactNo} placeholder="Contact Number"onChange = {this.handlechange} required/>
                                        <Message severity = "error" text = {this.state.formErrorMessage.contactNo} style = {{"color" : "red", "max-width": 400}}></Message> 
                                    </div>

                                    <div class="col-md-6">
                                        <input class="form-control" type="email" name="emailId" value={this.state.formValue.emailId} placeholder="Email Id"onChange = {this.handlechange} required/>
                                        <Message severity = "error" text = {this.state.formErrorMessage.emailId} style = {{"color" : "red", "max-width": 400}}></Message> 
                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <select class="form-control" id="branch" value={this.state.formValue.branchId} name = "branchId" onChange = {this.handlechange}>
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
                                
                                 <div class="col-md-12">
                                    <input class="form-control" type="text" value={this.state.formValue.address} name="address" placeholder="Enter Your Address"onChange = {this.handlechange} required/>
                                    <Message severity = "error" text = {this.state.formErrorMessage.address} style = {{"color" : "red", "max-width": 400}}></Message> 
                                 </div>
                                
                                 <div class="col-md-12">
                                    <input class="form-control" type="password" value={this.state.formValue.password} name="password" placeholder="password"onChange = {this.handlechange} required/>
                                    <Message severity = "error" text = {this.state.formErrorMessage.password} style = {{"color" : "red", "max-width": 400}}></Message> 
                                 </div>                                 
                                
                                 <div class="form-button mt-3">
                                    <button id="submit" type="submit" class="btn btn-primary"disabled = {!this.state.formValid.ButtonActive} onClick = {this.handleSubmit}>Register</button>
                                </div>
                                <br/>
                                {(this.state.successMessage.trim().length > 0 )?
                                    <div class="alert alert-success" role="alert" style = {{"max-width": 400}}>
                                        {this.state.successMessage}
                                    </div>:<></>
                                }

                                {(this.state.errorMessage.trim().length > 0 )?
                                    <div class="alert alert-danger" role="alert" style = {{"max-width": 400}}>
                                        {this.state.errorMessage}
                                    </div>:<></>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        )
    }



}
export default StudentRegister;
 