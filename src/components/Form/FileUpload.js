import { useState } from 'react';
import { useFormikContext } from 'formik';
import { Button, Form, Alert } from 'react-bootstrap';

import ReportsApi from '../../services/firebase.service'

// Test Content
const FileUpload = () => {
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { setFieldValue } = useFormikContext();

    async function uploadFile() {
        setLoading(true);
        try { 
            const {url, name} = await ReportsApi.upload(photo);

            setFieldValue('photoName', name);
            setFieldValue('candidatePhoto', url);

            setError("");
            setMsg("Photo uploaded");
        } catch (err) {
            setError(err);
            setMsg("");
        }
        setLoading(false);
    }

    return (
        <>
            <Form.File
                id="photo"
                accept="image/*"
                onChange={(e) => {
                    setPhoto(e.target.files[0]);
                }}
            />
            <br />
            <Button
                type="button"
                onClick={uploadFile}
                disabled={loading}
            >
                Upload
            </Button>
            <br />
            <div style={{ marginTop: "1rem" }}>
                {error.length > 0 && (
                    <Alert variant="danger">{error}</Alert>
                )}
                {msg.length > 0 && (
                    <Alert variant="success">{msg}</Alert>
                )}
            </div>
        </>
    )
}

export default FileUpload;