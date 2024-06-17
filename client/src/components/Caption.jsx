import { Row, Col, Button } from 'react-bootstrap';
import React from 'react';
import '../App.css'

export function Caption(props) {
  if (!props.captions) {
    return null;
  }
  return (
    <Row className="justify-content-center">
      {props.captions.map(caption => (
        <Col md={6} key={caption.id} className="mb-2 text-center">
          <Button variant="outline-primary" onClick={() => props.onCaptionClick(caption.id)}>
            {caption.text}
          </Button>
        </Col>
      ))}
    </Row>
  );
}
