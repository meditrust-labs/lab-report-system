import React, { useState } from 'react'
import {
    Container,
    Row,
    Col,
    Table,
    Button
} from 'react-bootstrap';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

import generatePdf from "@Helpers/pdfLib";
import ReportsApi from "@Services/firebase.service";

export default function TableView({ data, updateData }) {
    const [loading, setLoading] = useState(false);

    const deleteReport = async (id) => {
        setLoading(true);
        const toastId = toast.loading("Deleting report and the accociated data")
        const { photoName }  = data.find((report) => report.id === id).data()
        try {
            await ReportsApi.delete(photoName, id);
            toast.success("Report Deleted Successfully", {id: toastId});
        }
        catch (err) {
            console.log(err);
            toast.error(`An error occured`, {id: toastId});
        }

        const newData = data.filter((report) =>  report.id !== id);
        updateData(newData);
        setLoading(false);
    };

    const downloadReport = async (id, flag) => {
        setLoading(true);
        const toastId = toast.loading("generating report...")

        const reportData = data.find((report) => report.id === id).data();
        try {
            await generatePdf(reportData, flag);
            toast.success("Report Generated Successfully", {id: toastId})
        }
        catch (err) {
            console.log(err);
            toast.error("An error occured, please try again", { id: toastId })
        }

        setLoading(false);
    }

    return (
        <Container fluid>
            <Row className="mt-4">
                <Col className="text-center">
                    <Table
                        striped
                        bordered
                        hover
                    >
                    <thead
                        style={{
                        fontWeight: "bold"
                        }}
                    >
                        <tr>
                        <td> Lab Sr No </td>
                        <td> Full Name </td>
                        <td> Date Examined </td>
                        <td> Date Expiry </td>
                        <td> Date Of Birth </td>
                        <td> Passport No </td>
                        <td> Edit </td>
                        <td> Delete </td>
                        <td> Test Report </td>
                        <td> Final Report </td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((doc) => {
                        return (
                            <tr key={doc.id}>
                            <td>{doc.data().labSrNo}</td>
                            <td>{doc.data().fullName}</td>
                            <td>{doc.data().dateExamined}</td>
                            <td>{doc.data().dateExpiry}</td>
                            <td>{doc.data().dob}</td>
                            <td>{doc.data().passport}</td>
                            <td>
                                <Button
                                variant="primary"
                                >
                                <Link
                                    style={{
                                    color: '#fff',
                                    textDecoration: 'none'
                                    }}
                                    to={`/dashboard/create-report?edit=${doc.data().labSrNo}`}
                                >
                                    Edit
                                </Link>
                                </Button>
                            </td>
                            <td>
                                <Button
                                variant="danger"
                                onClick={() => deleteReport(doc.id)}
                                disabled={loading}
                                >
                                Delete
                                </Button>
                            </td>
                            <td>
                                <Button
                                variant="success"
                                onClick={() => downloadReport(doc.id, false)}
                                disabled={loading}
                                >
                                Download
                                </Button>
                            </td>
                            <td>
                                <Button
                                variant="success"
                                onClick={() => downloadReport(doc.id, true)}
                                disabled={loading}
                                >
                                Download
                                </Button>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}