var ClaimsPage = React.createClass({
  mixins: [
    ReactRouter.State,
    ReactRouter.Navigation,
    Fynx.connect(claimListStore, 'store'),
    Fynx.connect(claimStore, 'claimStore'),
    Fynx.connect(claimAbbreviatedStore, 'abbreviatedStore'),
  ],

  filters: {
    drafts: ["saved"],
    submitted: ["for_agent", "ready", "file_created", "uploaded", "acknowledged", "agent_attention"],
    rejected: ["doctor_attention"],
    done: ["done"]
  },


  search: function(ev) {
    var query = _.omit(this.getQuery(), 'page');
    query.search = ev.target.value;
    this.transitionTo('claims', {}, query);
  },

  componentWillMount: function() {
    var statusMap = {};
    _.each(this.filters, function(statuses, tab) {
      _.each(statuses, function(status) {
        statusMap[status] = tab;
      });
    });
    this.statusMap = statusMap;

    globalStore(globalStore().set('claimsListQuery', Immutable.fromJS(this.getQuery())));
  },

  componentWillReceiveProps: function(nextProps) {
    globalStore(globalStore().set('claimsListQuery', Immutable.fromJS(this.getQuery())));
  },


  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState.store.size !== 0;
  },

  render: function() {

    var claims = this.state.store.map(function(id) {
      return this.state.claimStore.get(id) || this.state.abbreviatedStore.get(id);
    }, this);


    var search = this.getQuery().search;
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
      if (claim.get('unread_comments')) {
        counts[this.statusMap[claim.get('status')]] = (counts[this.statusMap[claim.get('status')]] || 0) + 1;
      }
    }, this);

    var filter = this.filters[this.getQuery().filter];
    if (filter) {
      claims = claims.filter(function(claim) {
        return filter.indexOf(claim.get('status')) !== -1;
      }, this);
    }

    var sort = this.getQuery().sort || "";
    var desc = sort[0] === '-';
    if (desc) sort = sort.slice(1);

    if (sort) {
      claims = claims.sort(function(a,b) {
        if (a.get(sort) === b.get(sort)) return 0;
        else if (a.get(sort) < b.get(sort)) return desc ? 1 : -1;
        return desc ? -1 : 1;
      });
    }

    return (
      <div className="body">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <ul className="nav navbar-nav navbar-left">
              <li>
                {!window.ENV.CORDOVA && <NavItem href="http://billohip.ca" className="hidden-xs">BillOHIP</NavItem>}
              </li>
              <li>
                <div className="btn-group" role="group">
                  <ButtonLink to="new_claim" className="navbar-btn">
                    <Icon xs i="plus">New Claim</Icon>
                  </ButtonLink>
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
          <ClaimsTable claims={claims} search={""}/>
        </div>

        <nav className="navbar navbar-default navbar-fixed-bottom">
          <div className="container">
            <ul className="nav navbar-nav nav-justified">
              {_.map(_.keys(this.filters), function(filter) {
              var query = _.omit(this.getQuery(), 'page');
              if (query.filter === filter) {
                delete query.filter;
              } else {
                query.filter = filter;
              }
              return <NavItemLink key={filter} to="claims" query={query}>
                <span className="small">{s.humanize(filter)}{counts[filter] && <span className="badge">{counts[filter]}</span>}</span>
              </NavItemLink>
            }, this)}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
});

