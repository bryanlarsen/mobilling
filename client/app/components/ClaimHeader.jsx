import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { Icon, UserDropdown, Notice } from '../components';
import dollars from '../data/dollars';
import claimTotal from '../data/claimTotal';

export default React.createClass({
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

