import React from 'react'
import { Col, Card } from 'react-bootstrap'

export default function COL({ title, children }) {
    return (
        <Col>
            <Card>
                <Card.Body>
                    <Card.Title> 
                        {title} 
                    </Card.Title>
                    
                    { children }
                </Card.Body>
            </Card>
        </Col>
    )
}
