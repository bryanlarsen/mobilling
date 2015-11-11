import _ from 'underscore';
import s from 'underscore.string';
import { NavItem, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import ClaimsTable from '../components/ClaimsTable';
import Icon from '../components/Icon';
import UserDropdown from '../components/UserDropdown';
import { setDefaultQuery } from '../actions/globalActions';
import { refreshClaimList } from '../actions/claimActions';

export default connect(
  (state) => state
)(class ClaimsPage extends React.Component {
  constructor(props) {
    super(props);
    this.filters = {
      drafts: ["saved"],
      submitted: ["for_agent", "ready", "file_created", "uploaded", "acknowledged", "agent_attention"],
      rejected: ["doctor_attention"],
      done: ["done"]
    }
  }

  search(ev) {
    var query = _.omit(this.props.location.query, 'page');
    query.search = ev.target.value;
    this.transitionTo('claims', {}, query);
  }

  componentWillMount() {
    var statusMap = {};
    _.each(this.filters, function(statuses, tab) {
      _.each(statuses, function(status) {
        statusMap[status] = tab;
      });
    });
    this.statusMap = statusMap;

    this.props.dispatch(setDefaultQuery(this.props.location.query));
    this.props.dispatch(refreshClaimList());
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query !== this.props.globalStore.claimsListQuery) {
      this.props.dispatch(setDefaultQuery(this.props.location.query));
    }
  }

  render() {
    console.log('claimspage', this.props.location.query);
    let claims = this.props.claimStore.claimList.map(
      (id) => this.props.claimStore.claims[id]);

    var search = this.props.location.query.search;
    if (search) {
      re = new RegExp(search, 'i');
      claims = claims.filter(function(claim) {
        return (re.test(claim.get('number')) ||
                re.test(claim.get('status')) ||
                re.test(claim.get('service_date')) ||
                re.test(claim.get('patient_name')) );
      });
    }

    var counts = {};
    claims.forEach(function(claim) {
      if (claim.unread_comments) {
        counts[this.statusMap[claim.status]] = (counts[this.statusMap[claim.status]] || 0) + 1;
      }
    }, this);

    var filter = this.filters[this.props.location.query.filter];
    if (filter) {
      claims = claims.filter(function(claim) {
        return filter.indexOf(claim.status) !== -1;
      }, this);
    }

    var sort = this.props.location.query.sort || "";
    var desc = sort[0] === '-';
    if (desc) sort = sort.slice(1);

    if (sort) {
      claims = claims.sort(function(a,b) {
        if (a[sort] === b[sort]) return 0;
        else if (a[sort] < b[sort]) return desc ? 1 : -1;
        return desc ? -1 : 1;
      });
    }

    return (
      <div className="body">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <ul className="nav navbar-nav navbar-left">
              {!window.ENV.CORDOVA && <NavItem href="http://billohip.ca" className="hidden-xs">BillOHIP</NavItem>}
              <li>
                <div className="btn-group" role="group">
                  <LinkContainer to="/claim/new">
                    <Button className="navbar-btn">
                      <Icon xs i="plus">New Claim</Icon>
                    </Button>
                  </LinkContainer>
                </div>
              </li>
            </ul>
            <form className="navbar-form navbar-left">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Search" onChange={this.search} value={search} />
              </div>
            </form>
            <UserDropdown/>
          </div>
        </nav>

        <div className="content-body container with-bottom">
          <ClaimsTable {...this.props} location={this.props.location} claims={claims} />
        </div>

        <nav className="navbar navbar-default navbar-fixed-bottom">
          <div className="container">
            <ul className="nav navbar-nav nav-justified">
              {_.map(_.keys(this.filters), function(filter) {
              var query = _.omit(this.props.location.query, 'page');
              if (query.filter === filter) {
                delete query.filter;
              } else {
                query.filter = filter;
              }
              return <LinkContainer key={filter} to="/claims" query={query}>
                <NavItem>
                <span className="small">{s.humanize(filter)}{counts[filter] && <span className="badge">{counts[filter]}</span>}</span>
                </NavItem>
              </LinkContainer>
            }, this)}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
});
