const { Nav, Navbar, NavItem } = require('react-bootstrap');
const { LinkContainer } = require('react-router-bootstrap');

const Icon = require('./Icon');
const UserDropdown = require('./UserDropdown');
const Notice = require('./Notice');
const dollars = require('../data/dollars');
const { claimTotal } = require('../data/claimTotal');

module.exports = React.createClass({
  render: function() {
    var userIcon=(<Icon i="user"></Icon>);
    return (
    <div>
      <Navbar fixedTop>
        <Nav>
          <LinkContainer to="/claims" query={this.props.globalStore.claimsListQuery}>
            <NavItem><Icon xs i="list">List</Icon></NavItem>
          </LinkContainer>
          <li>
            <p className="navbar-text">
              #{this.props.claim.number}: ${dollars(claimTotal(this.props.claim))}
              {this.props.claim.unsaved && <span className="hidden-xs text-danger"> (unsaved)</span>}
            </p>
          </li>
          { this.props.submit ?
           <NavItem onClick={this.props.submit} className={this.props.claim.unsaved ? "text-danger" : ""}>
             <Icon i={"cog "+(this.props.globalStore.busy ? "fa-spin" : "")}>
               Submit
             </Icon>
           </NavItem> :
           <li to="claims" className={this.props.claim.unsaved ? "text-danger" : ""}>
             <p className="navbar-text">
               <Icon i={"cog "+(this.props.globalStore.busy ? "fa-spin" : "")}/>
             </p>
           </li>
           }
        </Nav>
        <UserDropdown/>
      </Navbar>
      <Notice {...this.props}/>
    </div>
    );
  }
});

