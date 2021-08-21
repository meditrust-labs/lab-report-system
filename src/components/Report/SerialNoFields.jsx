import TextField from "@Components/Form/TextField";
import COL from "@Components/Layouts/Col";

import Row from "react-bootstrap/Row";

export default function SerialNoFields() {
  return (
    <Row>
      <COL>
        <TextField name="labSrNo" label="Lab Sr No." disabled />
      </COL>
      <COL>
        <TextField name="refrenceNo" label="Reference No." disabled />
      </COL>
    </Row>
  );
}
