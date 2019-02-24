import React from 'react';
import Router from 'next/router';
import http from 'http';

import '../client/index.css';

class RSO extends React.Component {
  render () {
    return (<div className='rso-content'>
      <div className='media-left'>
        <a href='#'>
          <img className='img-fluid logo' src={this.props.logo} alt='' />
        </a>
      </div>
      <div className='media-body'>
        <div>
          <h3>{this.props.name}</h3>
          <p className='tag'>
            {this.props.category}
          </p>
        </div>
        <br />
        <p>{this.props.description}</p>
        <div className='icons'>
          <i className='fab fa-facebook fa-2x' />
          <i className='fas fa-globe fa-2x' />
          <i className='far fa-envelope fa-2x' />
        </div>
      </div>
    </div>);
  }
}

class Search extends React.Component {
  constructor (props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (event) {
    this.setState({value: event.target.value});
  }

  handleSubmit (event) {
    event.preventDefault();
    Router.push({
      pathname: '/',
      query: {
        search: this.state.value
      }
    });
  }

  render () {
    return (<form onSubmit={this.handleSubmit}>
      <input
        className='form-control input-lg'
        type='text'
        onChange={this.handleChange}
        value={this.state.value}
        placeholder='Search'
        aria-label='Search'
      />
      <div style={{cursor: 'pointer'}} onClick={this.handleSubmit}>
        <i className='fa fa-search' aria-hidden='true' />
      </div>
      <input type='submit' style={{display: 'none'}} />
    </form>);
  }
}

export default class Index extends React.Component {
  static async getInitialProps ({query: { search }}) {
    return new Promise((resolve, reject) => {
      http.get('http://localhost:3081/rsos' + (search ? ('/search?query=' + search) : ''), (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const json = JSON.parse(data);
          resolve({
            rsos: json
          });
        });
      });
    });
  }

  render () {
    let rsos = [];
    for (let i = 0; i < this.props.rsos.length; i++) {
      const rso = this.props.rsos[i];
      rsos.push((<RSO name={rso.name} description={rso.description} logo={rso.logo} category={rso.category} />));
    }
    return (<div>
      <nav className='navbar'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <a className='navbar-brand' href='#'><strong>RSO</strong> DIRECTORY</a>
          </div>
          <ul className='nav navbar-nav navbar-right'>
            <li><a href='#'><span className='glyphicon glyphicon-home' /></a></li>
            <li><a href='#'><span className='glyphicon glyphicon-calendar' /></a></li>
            <li><a href='#'><span className='glyphicon glyphicon-user' /></a></li>
          </ul>
        </div>
      </nav>

      <div className='col-sm-4' />

      <div className='col-sm-8'>
        <Search />
      </div>

      <div className='row'>
        <div className='col-sm-4 filter-container'>
          <ul className='list-group panel' id='filters'>
            <h3>Filters</h3>
            <li className='list-group-item'>First item</li>
            <li className='list-group-item'>Second item</li>
            <li className='list-group-item'>Third item</li>
          </ul>
        </div>

        <div className='col-sm-8 media' id='rsos'>
          {rsos}
        </div>
      </div>

      <footer>
        <ul className='pagination'>
          <li className='active'><a href='#'>1</a></li>
          <li><a href='#'>2</a></li>
          <li><a href='#'>3</a></li>
          <li><a href='#'>4</a></li>
          <li><a href='#'>5</a></li>
        </ul>
      </footer>
    </div>);
  }
}
