import React from 'react'
import { Col, Card } from 'react-bootstrap'

export default function Col({ title, children }) {
    return (
        <Col>
            <Card>
                <Card.Title> {title} </Card.Title>
                <Card.Body>
                    { children }
                </Card.Body>
            </Card>
        </Col>
    )
}
