import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import FileSaver from 'file-saver';

import LeadModal from '../../components/lead_modal.jsx';
import translate from '../../helpers/translate.js';
import { apiFetch } from '../../helpers/api_fetch.js';

class ListAssignLink extends Component {
  setList(listId) {
    this.state = {
      listId,
      modalOpen: false,
      loading: false
    }
  }

  constructor(props) {
    super(props);
    this.setList(props.listId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.listId !== this.state.listId) {
      this.setList(nextProps.params.listId);
    }
  }

  handleExportClick(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: true
    }));
  }

  handleClose(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: false
    }));
  }

  handleExportConfirmClick(ev) {
    this.setState(Object.assign({}, this.state, {
      loading: true
    }));
    apiFetch(`/api/v1/lists/${this.state.listId}/export`, {
      method: 'GET'
    }).then(res => {
      const filename = res.headers.get('Content-Disposition').match(/"(.*?)"/)[1];
      res.blob().then(blob => {
        FileSaver.saveAs(blob, filename);
        this.setState(Object.assign({}, this.state, {
          loading: false,
          modalOpen: false
        }));
      });
    });
  }

  render() {
    return (
      <span className={this.props.className}>
        <LeadModal isOpen={this.state.modalOpen} onRequestClose={this.handleClose.bind(this)}>
          <h1>{this.props.translate('Reassign all leads')}</h1>
          <p>{this.props.translate('All leads in this list will be moved to a different list')}</p>

          <a className='button is-large is-full-width'
             onClick={this.handleExportConfirmClick.bind(this)}>
            <i className='fa fa-fw fa-download'></i>
            {this.props.translate('Export')}
          </a>
        </LeadModal>
        <a onClick={this.handleExportClick.bind(this)}>
          <i className='fa fa-fw fa-arrow-right'></i> {this.props.translate('Assign all')}
        </a>
      </span>
    );
  }
}

export default translate('ListAssignLink')(ListAssignLink);
