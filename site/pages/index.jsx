import React from 'react';
import classnames from 'classnames';

import locales from '../locales';

const pages = {
  documents: {
    'install': require('./install'),
    'quick-start': require('./quick-start'),
    'i18n': require('./i18n'),
    'custom-theme': require('./custom-theme')
  },
  components: {
    'Basic': {
      'layout': require('./layout'),
      'color': require('./color'),
      'typography': require('./typography'),
      'icon': require('./icon'),
      'button': require('./button')
    },
    'Form': {
      'radio': require('./radio'),
      'checkbox': require('./checkbox'),
      'input': require('./input'),
      'input-number': require('./input-number'),
      'select': require('./select'),
      'cascader': require('./cascader'),
      'switch': require('./switch'),
      'slider': require('./slider'),
      'time-picker': require('./time-picker'),
      'date-picker': require('./date-picker'),
      'upload': require('./upload'),
      'rate': require('./rate'),
      'color-picker': require('./color-picker'),
      'form': require('./form')
    },
    'Data': {
      'table': require('./table'),
      'tag': require('./tag'),
      'progress': require('./progress'),
      'tree': require('./tree'),
      'pagination': require('./pagination'),
      'badge': require('./badge')
    },
    'Notice': {
      'alert': require('./alert'),
      'loading': require('./loading'),
      'message': require('./message'),
      'message-box': require('./message-box'),
      'notification': require('./notification')
    },
    'Nav': {
      'menu': require('./menu'),
      'tabs': require('./tabs'),
      'breadcrumb': require('./breadcrumb'),
      'dropdown': require('./dropdown'),
      'steps': require('./steps')
    },
    'Others': {
      'dialog': require('./dialog'),
      'tooltip': require('./tooltip'),
      'popover': require('./popover'),
      'card': require('./card'),
      'carousel': require('./carousel'),
      'collapse': require('./collapse')
    }
  }
};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    window.addEventListener("hashchange", () => {
      window.scrollTo(0, 0);

      this.setPage();
    }, false);
  }

  componentDidMount() {
    this.setPage(() => {
      if (!this.state.locale) {
        this.setLocale('zh-CN');
      }
    });
  }

  getLocale(key) {
    const map = locales[this.state.locale] || {};

    return key.split('.').reduce((a, b) => {
      const parent = map[a];

      if (b) {
        return (parent || {})[b];
      }

      return parent;
    });
  }

  setLocale(locale) {
    window.location.hash = `/${locale}/${this.state.page}`;
  }

  getPage() {
    const routes = location.hash.match(/(?:\/(.+))?\/(.+)/);

    if (routes) {
      localStorage.setItem('ELEMENT_LANGUAGE', this.state.locale = routes[1]);

      return routes[2];
    }

    return 'install';
  }

  setPage(fn) {
    this.setState({ page: this.getPage() }, fn);
  }

  getComponent(page) {
    this.components = this.components || Object.assign(Object.values(pages.components).reduce((a, b) => {
      return Object.assign(a, b);
    }, {}), pages.documents);

    const result = this.components[page];

    if (result) {
      return React.createElement(result.default, {
        locale: {
          show: this.getLocale('markdown.show'),
          hide: this.getLocale('markdown.hide')
        }
      });
    }
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <div className="container">
            <h1>
              <img src={require('../assets/logo.svg')} />
            </h1>
            <ul className="nav">
              <li className="nav-item">
                <a href={`http://element.eleme.io/#/${this.state.locale}/guide/design`}>{this.getLocale('misc.guide')}</a>
              </li>
              <li className="nav-item">
                <a className="active">{this.getLocale('misc.component')}</a>
              </li>
              <li className="nav-item">
                <a href={`http://element.eleme.io/#/${this.state.locale}/resource`}>{this.getLocale('misc.resource')}</a>
              </li>
              <li className="nav-item">
                <span className={classnames('nav-lang', { active: this.state.locale === 'zh-CN'})} onClick={this.setLocale.bind(this, 'zh-CN')}>中文</span>
                <span> / </span>
                <span className={classnames('nav-lang', { active: this.state.locale === 'en-US'})} onClick={this.setLocale.bind(this, 'en-US')}>En</span>
              </li>
            </ul>
          </div>
        </header>
        <div className="main container">
          <nav className="side-nav">
            <ul>
              <li className="nav-item">
                <a>{this.getLocale('misc.development')}</a>
                <ul className="pure-menu-list sub-nav">
                  {
                    Object.keys(pages.documents).map(page => {
                      return (
                        <li className="nav-item" key={page}>
                          <a href={`#/${this.state.locale}/${page}`} className={page === this.state.page ? 'active' : ''}>{this.getLocale(`page.${page}`)}</a>
                        </li>
                      )
                    })
                  }
                </ul>
              </li>
              <li className="nav-item">
                <a>{this.getLocale('misc.components')}</a>
                {
                  Object.keys(pages.components).map(group => {
                    return (
                      <div className="nav-group" key={group}>
                        <div className="nav-group__title">{group}</div>
                        <ul className="pure-menu-list">
                          {
                            Object.keys(pages.components[group]).map(page => {
                              return (
                                <li key={page} className="nav-item">
                                  <a href={`#/${this.state.locale}/${page}`} className={page === this.state.page ? 'active' : ''}>{this.getLocale(`page.${page}`)}</a>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </div>
                    )
                  })
                }
              </li>
            </ul>
          </nav>
          <div className="content">{ this.getComponent(this.state.page) }</div>
        </div>
        <footer className="footer">
          <div className="container">
            <div className="footer-main">
              <p className="footer-main-title">Element-React</p>
              <a href="https://github.com/eleme/element-react/issues" target="_blank" rel="noopener noreferrer" className="footer-main-link">{this.getLocale('misc.feedback')}</a>
              <a href="https://github.com/eleme/element-react/blob/master/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="footer-main-link">{this.getLocale('misc.contribution')}</a>
            </div>
            <div className="footer-social">
              <a href="//github.com/eleme/element-react" target="_blank" rel="noopener noreferrer">
                <img src={require('../assets/github.png')} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}
