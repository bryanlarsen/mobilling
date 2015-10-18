import _ from 'underscore';
import s from 'underscore.string';
import { Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { Icon, ClaimHeader } from '../components';
import { updateClaim } from '../actions';

export default React.createClass({
  icon: {
    patient: 'user',
    claim: 'medkit',
    consult: 'user-md',
    items: 'list-alt',
    comments: 'comment-o'
  },

  tabs: function() {
    if (this.props.claim.consult_tab_visible) {
      return ['patient', 'claim', 'consult', 'items', 'comments'];
    } else {
      return ['patient', 'claim', 'items', 'comments'];
    }
  },

  componentDidMount: function(ev) {
    this.fixTab();
  },

  componentDidUpdate: function(ev) {
    this.fixTab();
  },

  getTab: function() {
    return this.tabs().indexOf(_.find(this.tabs(), function(tab) {
      return this.props.routes[2] && this.props.routes[2].path === tab;
    }, this));
  },

  fixTab: function() {
    this.$ = $(ReactDOM.findDOMNode(this));
    this.$highlight = this.$.find('#highlight');

    var $el = this.$.find('#tab-nav > li:nth-child('+(this.getTab()+1)+')');
    if ($el.length) {
      this.$highlight.css({
        width: $el.css('width'),
        left: $el.position('left').left+'px'
      });
    }
  },

  submit: function(ev) {
    ev.preventDefault();
    this.props.dispatch(updateClaim(id, {status: 'for_agent'}));
  },

  render: function() {
    var unread_comments = this.props.claim.unread_comments;

    return (
      <div className="body">
        <ClaimHeader {...this.props} submit={(this.props.claim.status==='saved' || this.props.claim.status==='doctor_attention') && this.submit}/>

        <div className="container with-bottom">
          <div className="form-horizontal">
            {this.props.children && React.cloneElement(this.props.children, this.props)}
          </div>
        </div>

        <Navbar fixedBottom>
          <ul id="tab-nav" className="nav navbar-nav nav-justified" style={{position: 'relative'}}>
            { _.map(this.tabs(), function(tab) {
              return (
                <LinkContainer key={"claim_tab_"+tab} to={`/claim/${this.props.params.id}/${tab}`}>
                  <NavItem>
                    <Icon i={this.icon[tab]} xs>{s.humanize(tab)} </Icon>
                    {tab === 'comments' && unread_comments > 0 && <span className="badge">{unread_comments}</span>}
                  </NavItem>
                </LinkContainer>
              );
            }, this) }
            <div id="highlight"></div>
          </ul>
        </Navbar>
      </div>
    );
  }
});

