import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import FileSaver from 'file-saver';

import LeadModal from '../../components/lead_modal.jsx';
import translate from '../../helpers/translate.js';
import { apiFetch } from '../../helpers/api_fetch.js';

class ExportListLink extends Component {
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
          loading: false
        }));
      });
    });
  }

  render() {
    let button = null;
    if (!this.state.loading) {
      button = (
        <a className='button is-large is-full-width'
           onClick={this.handleExportConfirmClick.bind(this)}>
          <i className='fa fa-fw fa-download'></i>
          {this.props.translate('Export')}
        </a>
      );
    } else {
      button = (
        <a disabled className='button is-large is-full-width'>
          <i className='fa fa-fw fa-spin fa-circle-o-notch'></i>
          {this.props.translate('Exporting...')}
        </a>
      );
    }
    return (
      <span className={this.props.className}>
        <LeadModal isOpen={this.state.modalOpen} onRequestClose={this.handleClose.bind(this)}>
          <h1>{this.props.translate('Export this list?')}</h1>
          <p>{this.props.translate('Exporting the list might take a few moments.')}</p>

          {button}
        </LeadModal>
        <a onClick={this.handleExportClick.bind(this)}>
          <i className='fa fa-fw fa-download'></i> {this.props.translate('Export')}
        </a>
      </span>
    );
  }
}

export default translate('ExportListLink')(ExportListLink);
