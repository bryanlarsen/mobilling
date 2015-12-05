import detailsGenerator from '../app/data/detailsGenerator';

describe("details generator", function () {
     it("returns empty array for empty claim", function () {
         expect(detailsGenerator({})).toEqual([]);
     });

     it("returns correct codes #1 (when First Date Seen = Admission Date; MRP = Yes; Consult on First Date = Yes)", function () {
         expect(detailsGenerator({
             admission_on: "2014-06-09",
             first_seen_on: "2014-06-09",
             last_seen_on: "2014-07-20",
             last_seen_discharge: true,
             most_responsible_physician: true,
             consult_type: "general_er",
             specialty: "internal_medicine",
             first_seen_consult: true
         })).toEqual([
        { day: "2014-06-09", rows: [{code: "A135A"}, { code: "E082A" }], time_in: null, time_out: null },
        { day: "2014-06-10", rows: [{code: "C122A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-11", rows: [{code: "C123A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-12", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-13", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-14", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-15", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-16", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-17", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-18", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-19", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-20", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-21", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-22", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-23", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-24", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-25", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-26", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-27", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-28", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-29", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-06-30", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-01", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-02", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-03", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-04", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-05", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-06", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-07", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-08", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-09", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-10", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-11", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-12", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-13", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-14", rows: [{code: "C132A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-15", rows: [{code: "C137A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-16", rows: [{code: "C137A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-17", rows: [{code: "C137A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-18", rows: [{code: "C137A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-19", rows: [{code: "C137A"}, { code: "E083A" }], time_in: null, time_out: null },
        { day: "2014-07-20", rows: [{code: "C124A"}, { code: "E083A" }], time_in: null, time_out: null },
         ]);
     });

//     it("returns correct codes #2 (when First Date Seen <> Admission Date; MRP = 		Yes; Consult on First Date = Yes)", function () {
//         expect(detailsGenerator({
//             admission_on: "2014-06-09",
//             first_seen_on: "2014-06-12",
//             last_seen_on: "2014-07-20",
//             last_seen_discharge: true,
//             most_responsible_physician: true,
//             consult_type: "general_er",
//             specialty: "internal_medicine"
//         })).toEqual([
//             { day: "2014-06-12", code: "A135A", premiums: [], autogenerated: true, time_in: null, time_out: null }, // admission + 3
//             { day: "2014-06-13", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-14", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-15", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-16", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-17", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-18", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-19", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-20", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-21", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-22", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-23", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-24", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-25", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-26", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-27", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-28", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-29", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-30", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-01", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-02", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-03", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-04", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-05", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-06", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-07", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-08", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-09", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-10", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-11", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-12", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-13", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-14", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-15", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 36
//             { day: "2014-07-16", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-17", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-18", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-19", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-20", code: "C124A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//         ]);
//     });

//     it("returns correct codes #3 (when First Date Seen = Admission Date; MRP = No; Consult on First Date = Yes)", function () {
//         expect(detailsGenerator({
//             admission_on: "2014-06-09",
//             first_seen_on: "2014-06-09",
//             last_seen_on: "2014-07-20",
//             last_seen_discharge: true,
//             most_responsible_physician: false,
//             consult_type: "general_er",
//             specialty: "internal_medicine"
//         })).toEqual([
//             { day: "2014-06-09", code: "A135A", premiums: [], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-10", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-11", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-12", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-13", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-14", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-15", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-16", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-17", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-18", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-19", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-20", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-21", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-22", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-23", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-24", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-25", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-26", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-27", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-28", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-29", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-30", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-01", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-02", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-03", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-04", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-05", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-06", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-07", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-08", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-09", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-10", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-11", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-12", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-13", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-14", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-15", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-16", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-17", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-18", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-19", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-20", code: "C138A", autogenerated: true, time_in: null, time_out: null }
//         ]);
//     });

//     it("returns correct codes #4 (when First Date Seen <> Admission Date; MRP = No; Consult on First Date = Yes)", function () {
//         expect(detailsGenerator({
//             admission_on: "2014-06-09",
//             first_seen_on: "2014-06-12",
//             last_seen_on: "2014-07-20",
//             last_seen_discharge: true,
//             most_responsible_physician: false,
//             consult_type: "general_er",
//             specialty: "internal_medicine"
//         })).toEqual([
//             { day: "2014-06-12", code: "A135A", premiums: [], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-13", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-14", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-15", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-16", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-17", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-18", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-19", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-20", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-21", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-22", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-23", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-24", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-25", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-26", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-27", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-28", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-29", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-30", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-01", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-02", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-03", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-04", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-05", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-06", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-07", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-08", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-09", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-10", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-11", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-12", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-13", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-14", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-15", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-16", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-17", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-18", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-19", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-20", code: "C138A", autogenerated: true, time_in: null, time_out: null }
//         ]);
//     });

//     it("returns correct codes #5 (when First Date Seen <> Admission Date; MRP = Yes; Consult on First Date = No)", function () {
//         expect(detailsGenerator({
//             admission_on: "2014-06-09",
//             first_seen_on: "2014-06-12",
//             last_seen_on: "2014-07-20",
//             last_seen_discharge: true,
//             most_responsible_physician: true,
//             specialty: "internal_medicine"
//         })).toEqual([
//             { day: "2014-06-12", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 3
//             { day: "2014-06-13", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-14", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-15", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-16", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-17", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-18", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-19", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-20", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-21", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-22", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-23", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-24", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-25", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-26", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-27", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-28", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-29", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-30", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-01", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-02", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-03", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-04", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-05", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-06", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-07", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-08", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-09", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-10", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-11", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-12", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-13", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-14", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-15", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 36
//             { day: "2014-07-16", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-17", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-18", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-19", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-20", code: "C124A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//         ]);
//     });

//     it("returns correct codes #6 (when First Date Seen <> Admission Date; MRP = No; Consult on First Date = No; Transfer from ICU/CCU = No)", function () {
//         expect(detailsGenerator({
//             admission_on: "2014-06-09",
//             first_seen_on: "2014-06-10",
//             last_seen_on: "2014-07-20",
//             last_seen_discharge: true,
//             icu_transfer: false,
//             specialty: "internal_medicine"
//         })).toEqual([
//             { day: "2014-06-10", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-11", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-12", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-13", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-14", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-15", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-16", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-17", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-18", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-19", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-20", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-21", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-22", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-23", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-24", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-25", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-26", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-27", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-28", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-29", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-30", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-01", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-02", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-03", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-04", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-05", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-06", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-07", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-08", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-09", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-10", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-11", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-12", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-13", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-14", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-15", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-16", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-17", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-18", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-19", code: "C138A", autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-20", code: "C138A", autogenerated: true, time_in: null, time_out: null }
//         ]);
//     });

//     it("returns correct codes #7 (when First Date Seen <> Admission Date; MRP = Yes; Consult on First Date = No; Transfer from ICU/CCU = Yes)", function () {
//         expect(detailsGenerator({
//             admission_on: "2014-06-09",
//             first_seen_on: "2014-06-10",
//             last_seen_on: "2014-07-20",
//             last_seen_discharge: true,
//             most_responsible_physician: true,
//             icu_transfer: true,
//             specialty: "internal_medicine"
//         })).toEqual([
//             { day: "2014-06-10", code: "C142A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 1
//             { day: "2014-06-11", code: "C143A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 2
//             { day: "2014-06-12", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 3
//             { day: "2014-06-13", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-14", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-15", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-16", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-17", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-18", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-19", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-20", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-21", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-22", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-23", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-24", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-25", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-26", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-27", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-28", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-29", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-30", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-01", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-02", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-03", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-04", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-05", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-06", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-07", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-08", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-09", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-10", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-11", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-12", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-13", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-14", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-15", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 36
//             { day: "2014-07-16", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-17", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-18", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-19", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-20", code: "C124A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null } // discharge
//         ]);
//     });

//     it("returns correct codes #8 (when First Date Seen <> Admission Date; MRP = Yes; Consult on First Date = No)", function () {
//         expect(detailsGenerator({
//             admission_on: "2014-06-09",
//             first_seen_on: "2014-06-10",
//             last_seen_on: "2014-07-20",
//             last_seen_discharge: true,
//             most_responsible_physician: true,
//             specialty: "internal_medicine"
//         })).toEqual([
//             { day: "2014-06-10", code: "C122A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 1
//             { day: "2014-06-11", code: "C123A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 2
//             { day: "2014-06-12", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 3
//             { day: "2014-06-13", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-14", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-15", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-16", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-17", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-18", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-19", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-20", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-21", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-22", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-23", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-24", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-25", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-26", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-27", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-28", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-29", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-06-30", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-01", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-02", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-03", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-04", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-05", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-06", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-07", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-08", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-09", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-10", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-11", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-12", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-13", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-14", code: "C132A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-15", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // admission + 36
//             { day: "2014-07-16", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-17", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-18", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-19", code: "C137A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null },
//             { day: "2014-07-20", code: "C124A", premiums: [{ code: "E083A" }], autogenerated: true, time_in: null, time_out: null }, // discharge
//         ]);
//     });

    it("returns correct codes #9 (when discharge date falls within day 1 after admission)", function () {
      expect(detailsGenerator({
        admission_on: "2014-06-09",
        first_seen_on: "2014-06-09",
        last_seen_on: "2014-06-10",
        last_seen_discharge: true,
        most_responsible_physician: true,
        consult_type: "general_er",
        specialty: "internal_medicine",
        first_seen_consult: true
      })).toEqual([
        { day: "2014-06-09", rows: [{code: "A135A"}, { code: "E082A" }], time_in: null, time_out: null },
        { day: "2014-06-10", rows: [{code: "C122A"}, { code: "E083A" }], time_in: null, time_out: null },
      ]);
    });

    it("returns correct codes #10 (when discharge date falls within day 2 after admission)", function () {
        expect(detailsGenerator({
            admission_on: "2014-06-09",
            first_seen_on: "2014-06-09",
            last_seen_on: "2014-06-11",
            last_seen_discharge: true,
            most_responsible_physician: true,
            consult_type: "general_er",
          specialty: "internal_medicine",
          first_seen_consult: true
        })).toEqual([
          { day: "2014-06-09", rows: [{code: "A135A"}, { code: "E082A" }], time_in: null, time_out: null },
          { day: "2014-06-10", rows: [{code: "C122A"}, { code: "E083A" }], time_in: null, time_out: null },
          { day: "2014-06-11", rows: [{code: "C123A"}, { code: "E083A" }], time_in: null, time_out: null },
        ]);
    });
});
