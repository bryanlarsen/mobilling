const ClaimStaticOptional = require('./ClaimStaticOptional');
const ClaimPatient = require('./ClaimPatient');
const ClaimTab = require('./ClaimTab');
const ConsultTab = require('./ConsultTab');
const ItemsTab = require('./ItemsTab');
const CommentsTab = require('./CommentsTab');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <fieldset>
          <ClaimStaticOptional {...this.props} name="number" />
          <ClaimStaticOptional {...this.props} name="status" />
        </fieldset>
        <fieldset>
          <legend>Patient</legend>

          <ClaimPatient {...this.props} agent />
        </fieldset>

        <fieldset>
          <legend>Claim</legend>
          <ClaimTab {...this.props} agent />
        </fieldset>

        { this.props.claim.consult_tab_visible &&
         <fieldset>
          <legend>Consult</legend>
          <ConsultTab {...this.props} agent />
         </fieldset>
        }

        <fieldset>
          <legend>Items</legend>
          <ItemsTab {...this.props} agent />
        </fieldset>

        <fieldset>
          <CommentsTab {...this.props} agent />
        </fieldset>

      </div>
    );
  },

});
