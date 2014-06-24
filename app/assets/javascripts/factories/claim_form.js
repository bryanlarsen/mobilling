angular.module("moBilling.factories.claimForm", [])

    .factory("ClaimForm", function () {
        var ClaimForm = function (attributes) {
            angular.extend(this, attributes);
        };

        ClaimForm.fromResource = function (resource) {
            var attributes = {};

            attributes.id = resource.id;
            attributes.photo_id = resource.photo_id;
            attributes.patient_name = resource.patient_name;
            attributes.hospital = resource.hospital;
            attributes.referring_physician = resource.referring_physician;
            attributes.diagnosis = resource.diagnosis;
            attributes.most_responsible_physician = resource.most_responsible_physician;
            attributes.admission_on = resource.admission_on;
            attributes.first_seen_admission = (resource.admission_on === resource.first_seen_on);
            attributes.first_seen_on = resource.first_seen_on;
            attributes.last_seen_on = resource.last_seen_on;
            attributes.last_seen_discharge = resource.last_seen_discharge;

            return new this(attributes);
        };

        ClaimForm.prototype.toResource = function () {
            var attributes = {};

            attributes.id = this.id;
            attributes.photo_id = this.photo_id;
            attributes.patient_name = this.patient_name;
            attributes.hospital = this.hospital;
            attributes.referring_physician = this.referring_physician;
            attributes.diagnosis = this.diagnosis;
            attributes.most_responsible_physician = this.most_responsible_physician;
            attributes.admission_on = this.admission_on;
            attributes.first_seen_on = this.first_seen_admission ? this.admission_on : this.first_seen_on;
            attributes.last_seen_on = this.last_seen_on;
            attributes.last_seen_discharge = this.last_seen_discharge;

            return attributes;
        };

        return ClaimForm;
    });
