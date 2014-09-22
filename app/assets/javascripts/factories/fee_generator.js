angular.module("moBilling.factories")

    .factory("feeGenerator", function () {
        var inMinutes = function(time) {
            return parseInt(time.slice(0,2))*60+parseInt(time.slice(3));
        };

        var overtimeRate = function(service_code) {
            return {
                'E400B': 0.5,
                'E401B': 0.75,
                'E400C': 0.5,
                'E401C': 0.75
            }[service_code.code];
        };

        return function(claim, detail, service_code) {
            if (isNaN(Date.parse(detail.day)) || !service_code.code) return {};
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

            var overtime = overtimeRate(service_code);
            if (overtime) {
                var master;
                // find master detail
                for (var i = 0; i < claim.daily_details.length; i++) {
                    var master = claim.daily_details[i];
                    if (master !== detail &&
                        master.time_in === detail.time_in &&
                        master.time_out === detail.time_out &&
                        master.units !== 1) break;
                    else master = null;
                }

                if (!master || !master.fee) return {};

                return {
                    fee: Math.round(master.fee * overtime),
                    units: master.units
                };
            } else if (service_code.code[4] !== 'A' && service_code.fee % unit_fee === 0) {
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
    });
