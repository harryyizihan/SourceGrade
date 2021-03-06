import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validUrl from 'valid-url';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Modal,
  Button,
  ButtonToolbar,
  Alert,
} from 'react-bootstrap';
import { history } from '../../store';

import { addClass, removeAlert } from '../../modules/home';

import AddClassContainer from './AddClassContainer';
import GradesForm from './GradesForm';
import GithubButtons from './GithubButtons';

class Home extends React.Component {
  static propTypes = {
    /**
     * Action creator to add a new class to DB
     * @type {function}
     */
    addClass: PropTypes.func,
    /**
     * Action creator to dismiss alerts
     * @type {function}
     */
    removeAlert: PropTypes.func,
    /**
     * Boolean whether class was added successfully
     * @type {bool}
     */
    added: PropTypes.bool,
    /**
     * Error message from unsuccessful class add
     * @type {string}
     */
    error: PropTypes.string,
  }

  static defaultProps = {
    addClass() {},
    removeAlert() {},
    added: false,
    error: '',
  }

  static handleFormSubmit(id, currentClass) {
    history.push(`/grades?id=${id}&url=${currentClass.value}`);
  }

  constructor(props) {
    super(props);

    this.onModalHide = this.onModalHide.bind(this);
    this.onModalShow = this.onModalShow.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onUrlChange = this.onUrlChange.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.getValidationState = this.getValidationState.bind(this);

    this.state = {
      showModal: false,
      url: '',
    };
  }

  onModalShow() {
    this.setState({
      showModal: true,
    });
  }

  onModalHide() {
    this.setState({
      showModal: false,
      url: '',
    });
    this.props.removeAlert();
  }

  onFormSubmit(e) {
    e.preventDefault();

    const { url } = this.state;

    if (url.length > 0) {
      this.props.addClass(url);
    }
  }

  onUrlChange(e) {
    this.setState({ url: e.target.value });
  }

  getValidationState() {
    const { url } = this.state;
    let valid = false;
    if (url.length > 10 && validUrl.isUri(url) && (url.slice(-10) === 'index.html')) {
      valid = true;
    }
    return valid ? 'success' : 'warning';
  }

  renderAlert() {
    if (this.props.added) {
      return (
        <Alert bsStyle="success" onDismiss={this.props.removeAlert}>Added Class Successfully!</Alert>
      );
    } else if (this.props.error) {
      return (
        <Alert bsStyle="danger" onDismiss={this.props.removeAlert}>{this.props.error}</Alert>
      );
    }

    return null;
  }

  render() {
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col md={6} sm={8} mdOffset={3} smOffset={2} className="text-center">
              <h2 className="text-center">Easily search for your grades on GradeSource!</h2>
              <h3>For a demonstration, try:</h3>
              <p>Secret Number: 8010, Class: Math 20 - Spring, 2000</p>
              <GradesForm
                handleFormSubmit={Home.handleFormSubmit}
                buttonText="Get Grades"
              />
              <AddClassContainer>
                <p>Class not found?</p>
                <Button onClick={this.onModalShow} bsStyle="default">Add New Class</Button>
              </AddClassContainer>
              <GithubButtons />
            </Col>
          </Row>
        </Grid>
        {/* Modal to add a new class */}
        <Modal show={this.state.showModal} onHide={this.onModalHide}>
          <Modal.Header closeButton>
            <Modal.Title>Add a new class</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderAlert()}
            <h3>Add a Class if it has not already been added</h3>
            <FormGroup controlId="url" validationState={this.getValidationState()}>
              <ControlLabel>Enter Class URL</ControlLabel>
              <FormControl
                type="url"
                onChange={this.onUrlChange}
                value={this.state.url}
                placeholder="http://www.gradesource.com/demo/example1/index.html"
              />
              <FormControl.Feedback />
              <HelpBlock>Make sure course page ends in index.html and has grades uploaded</HelpBlock>
            </FormGroup>
            <ButtonToolbar>
              <Button bsStyle="primary" type="submit" onClick={this.onFormSubmit}>Submit</Button>
              <Button bsStyle="default" onClick={this.onModalHide}>Close</Button>
            </ButtonToolbar>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  added: state.classes.added,
  error: state.classes.error,
});

export default connect(mapStateToProps, { addClass, removeAlert })(Home);
