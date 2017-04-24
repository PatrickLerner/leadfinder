import React, { Component } from 'react';
import translate from '../../helpers/translate.js';
import { apiFetch } from '../../helpers/api_fetch.js';
import Entry from '../list/entry.jsx';

class LatestEntries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestEntries: []
    };
  }

  componentWillMount() {
    apiFetch(`/api/v1/entries/latest`, {
      'method': 'GET'
    }).then(res => res.json()).then(data => {
      this.setState(Object.assign({}, this.state, { latestEntries: data.entries }));
    });
  }

  render() {
    if (this.state.latestEntries.length > 0) {
      return this.renderEntries();
    } else {
      return this.renderNoEntries();
    }
  }

  renderNoEntries() {
    return (<div></div>)
  }

  renderEntries() {
    const latestEntries = this.state.latestEntries.map(entry => {
      return (<Entry entry={entry} key={entry.id} />);
    });

    return (
      <div>
        <h2 className='page-subtitle'>{this.props.translate('Latest leads')}</h2>

        <div className='lookup lookup-dashboard-latest'>
          {latestEntries}
        </div>
      </div>
    );
  }
}

export default translate('LatestEntries')(LatestEntries);
