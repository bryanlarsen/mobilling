import { ClaimStaticOptional, ClaimPatient, ClaimTab, ConsultTab, ItemsTab, CommentsTab } from '../components';

export default React.createClass({
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
