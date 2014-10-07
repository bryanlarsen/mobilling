angular.module("moBilling.factories")

    .factory("feeGenerator", function (ServiceCode, $q) {
        var inMinutes = function(time) {
            return parseInt(time.slice(0,2), 10) * 60 + parseInt(time.slice(3), 10);
        };

        var overtimeRate = function(service_code) {
            return {
                'E400B': 0.5,
                'E401B': 0.75,
                'E400C': 0.5,
                'E401C': 0.75,
                'E082A': 0.3,
                'E083A': 0.3
            }[service_code.code];
        };

        var calculateFee = function(detail, service_code) {
            var unit_fee = service_code.fee, border1 = 0, border2 = 0;
            var units, fee;

            // valid as of September 1, 2011.   Adjust based on detail.day when it changes
            if (service_code.code[4] === 'B') {
                unit_fee = 1204;
                border1 = 60;
                border2 = 150;
            } else if (service_code.code[4] === 'C') {
                unit_fee = 1501;
                border1 = 60;
                border2 = 90;
            }

            var minutes = 0;
            if (detail.time_in && detail.time_out) {
                minutes = inMinutes(detail.time_out) - inMinutes(detail.time_in);
                if (minutes < 0) minutes = minutes + 24*60;
            }

            if (service_code.code[4] !== 'A' && service_code.fee % unit_fee === 0) {
                units = Math.ceil(Math.min(minutes, border1) / 15);
                if (minutes > border1) {
                    units = units + Math.ceil(Math.min(minutes - border1, border2 - border1) / 15.0) * 2;
                }
                if (minutes > border2) {
                    units = units + Math.ceil((minutes - border2) / 15.0) * 3;
                }

                units += service_code.fee / unit_fee;
                fee = units * unit_fee;
            } else {
                fee = service_code.fee;
                units = 1;
            }

            return {
                fee: fee,
                units: units
            };
         };

        return function(claim, detail) {
            var deferred = $q.defer();

            detail.fee = null;
            detail.units = null;
            detail.total_fee = null;

            if (isNaN(Date.parse(detail.day))) {
                deferred.resolve(false);
                return deferred.promise;
            }

            ServiceCode.find(detail.code).then(function (service_code) {
                if (!service_code || !service_code.code) {
                    return deferred.resolve(false);
                }

                var result = calculateFee(detail, service_code);
                if (!result.fee) {
                    return deferred.resolve(false);
                } else {
                    detail.fee = result.fee;
                    detail.units = result.units;
                }

                $q.all((detail.premiums || []).map(function (premium) {
                    premium.fee = undefined;
                    premium.units = undefined;
                    return ServiceCode.find(premium.code);
                })).then(function (premium_codes) {
                    detail.total_fee = result.fee;
                    for(var i = 0; i < premium_codes.length; i++) {
                        if (!premium_codes[i]) {
                            detail.total_fee = undefined;
                            return deferred.resolve(false);
                        }

                        var overtime = overtimeRate(premium_codes[i]);
                        if (overtime) {
                            var ofee = Math.round(result.fee * overtime);
                            detail.total_fee = detail.total_fee + ofee;
                            detail.premiums[i].fee = ofee;
                            detail.premiums[i].units = detail.units;
                        } else {
                            var o = calculateFee(detail, premium_codes[i]);
                            if (o.fee) {
                                detail.premiums[i].fee = o.fee;
                                detail.premiums[i].units = o.units;
                                detail.total_fee = detail.total_fee + o.fee;
                            } else {
                                detail.total_fee = undefined;
                                return deferred.resolve(false);
                            }
                        }
                    }

                    return deferred.resolve(true);
               });
            });

            return deferred.promise;
        };
    });
