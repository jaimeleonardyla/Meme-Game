import { Row, Col, Button } from 'react-bootstrap';
import React from 'react';
import { Link } from 'react-router-dom';


export function Caption(props){
    if (!props.captions) {
      return null;
    }
    return (
        <>
          {props.captions.map(caption => (
            <Row key={caption.id}>
                <Col as='p' className='text-center lead'>
                <Button variant="outline-primary" onClick={() => props.onCaptionClick(caption.id)}>
                  {caption.text}
                  </Button>

                </Col>
            </Row>
          ))}
          <Link className='btn btn-danger mx-2 my-2' to={'/meme'} >Cancel</Link>

        </>
    );
}
    
