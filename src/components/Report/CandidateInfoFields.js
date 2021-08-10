import { Row } from 'react-bootstrap'

import {
    DateField,
    FileUpload,
    TextField,
    TextFieldWithUnit,
    SelectField,
} from '@Form'

import {
    ExpiryDateField,
    DisplayPhoto
} from '@Form/ReactiveFields'

import COL from '@Layouts/Col'
import Heading from '@Components/Heading'

export default function CandidateInfoFields() {
    return (
        <>
            <Heading> Candidate Information </Heading>
            <Row>
                <COL title="Date">
                    <DateField name="dateExamined" label="Examined Date" required/>
                    <ExpiryDateField name="dateExpiry" label="Expiry Date" disabled={true} required/>
                </COL>
                <COL title="Upload Photo">
                    <FileUpload />                
                </COL>
                <COL title="Candidate Photo"> 
                    <DisplayPhoto />
                </COL>
            </Row>
            <br />
            <br />
            <Row>
                <COL>
                      <TextField name="fullName" label="Full Name" required/>
                      <TextField name="age" label="Age" required/>
                      <SelectField name="gender" label="Gender" required>
                        <option value="">-- Select --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </SelectField>
                      <TextFieldWithUnit name="height" label="Height" unit="cm" />
                </COL>
                <COL>
                      <TextFieldWithUnit name="weight" label="Weight" unit="kg" />
                      <SelectField name="maritalStatus" label="Marital Status" required>
                          <option value="">-- Select --</option>
                          <option value="Married"> Married </option>
                          <option value="Unmarried"> Unmarried </option>
                      </SelectField>
                      <DateField name="dob" label="Date of Birth" required/>
                      <DateField name="doi" label="Date of Issue" required/>
                </COL>
                <COL>
                    <TextField name="poi" label="Place of Issue" required/>
                    <TextField name="nationality" label="Nationality" required/>
                    <TextField name="passport" label="Passport No." required/>
                    <TextField name="post" label="Post applied for." required/>
                </COL>
            </Row>
        </>
    )
}