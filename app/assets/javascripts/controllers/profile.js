angular.module("moBilling.controllers")

    .controller("ProfileController", function ($scope, $location, User, user, agents, specialties, currentUser) {
        $scope.initialize = function () {
            $scope.agents = agents;
            $scope.specialties = specialties;
            $scope.user = user;

            $scope.office_codes = [
                { name: 'Hamilton (G)', code: 'G' },
                { name: 'Kingston (J)', code: 'J' },
                { name: 'London (P)', code: 'P' },
                { name: 'Missisauga (E)', code: 'E' },
                { name: 'Oshawa (F)', code: 'F' },
                { name: 'Ottawa (D)', code: 'D' },
                { name: 'Sudbury (R)', code: 'R' },
                { name: 'Thunder Bay (U)', code: 'U' },
                { name: 'Toronto (N)', code: 'N' }
            ];

            $scope.specialty_codes = [
                { name: 'Family Practice and Practice In General (00)', code: 0 },
                { name: 'Anaesthesia (01)', code: 1 },
                { name: 'Dermatology (02)', code: 2 },
                { name: 'General Surgery (03)', code: 3 },
                { name: 'Neurosurgery (04)', code: 4 },
                { name: 'Community Medicine (05)', code: 5 },
                { name: 'Orthopaedic Surgery (06)', code: 6 },
                { name: 'Geriatrics (07)', code: 7 },
                { name: 'Plastic Surgery (08)', code: 8 },
                { name: 'Cardiovascular and Thoracic Surgery (09)', code: 9 },
                { name: 'Emergency Medicine (12)', code: 12 },
                { name: 'Internal Medicine (13)', code: 13 },
                { name: 'Neurology (18)', code: 18 },
                { name: 'Psychiatry (19)', code: 19 },
                { name: 'Obstetrics and Gynaecology (20)', code: 20 },
                { name: 'Genetics (22)', code: 22 },
                { name: 'Ophthalmology (23)', code: 23 },
                { name: 'Otolaryngology (24)', code: 24 },
                { name: 'Paediatrics (26)', code: 26 },
                { name: 'Non-medical Laboratory Director (Provider Number Must Be 599993) (27)', code: 27 },
                { name: 'Pathology (28)', code: 28 },
                { name: 'Microbiology (29)', code: 29 },
                { name: 'Clinical Biochemistry (30)', code: 30 },
                { name: 'Physical Medicine (31)', code: 31 },
                { name: 'Diagnostic Radiology (33)', code: 33 },
                { name: 'Therapeutic Radiology (34)', code: 34 },
                { name: 'Urology (35)', code: 35 },
                { name: 'Gastroenterology (41)', code: 41 },
                { name: 'Respiratory Diseases (47)', code: 47 },
                { name: 'Rheumatology (48)', code: 48 },
                { name: 'Dental Surgery (49)', code: 49 },
                { name: 'Oral Surgery (50)', code: 50 },
                { name: 'Orthodontics (51)', code: 51 },
                { name: 'Paedodontics (52)', code: 52 },
                { name: 'Periodontics (53)', code: 53 },
                { name: 'Oral Pathology (54)', code: 54 },
                { name: 'Endodontics (55)', code: 55 },
                { name: 'Optometry (56)', code: 56 },
                { name: 'Osteopathy (57)', code: 57 },
                { name: 'Chiropody (Podiatry) (58)', code: 58 },
                { name: 'Chiropractics (59)', code: 59 },
                { name: 'Cardiology (60)', code: 60 },
                { name: 'Haematology (61)', code: 61 },
                { name: 'Clinical Immunology (62)', code: 62 },
                { name: 'Nuclear Medicine (63)', code: 63 },
                { name: 'Thoracic Surgery (64)', code: 64 },
                { name: 'Oral Radiology (70)', code: 70 },
                { name: 'Prosthodontics (71)', code: 71 },
                { name: 'Midwife (referral only) (75)', code: 75 },
                { name: 'Nurse Practitioner (76)', code: 76 },
                { name: 'Private Physiotherapy Facility (Approved to Provide Home Treatment Only) (80)', code: 80 },
                { name: 'Private Physiotherapy Facility (Approved to Provide Office and Home Treatment) (81)', code: 81 },
                { name: 'Alternate Health Care Profession (85)', code: 85 },
                { name: 'IHF Non-Medical Practitioner (Provider Number Must Be 991000) (90)', code: 90 }
            ];
        };

        function success(user) {
            currentUser.signIn(user);
            $location.path("/claims").hash("").replace();
        };

        function error(response) {
            $scope.submitting = false;
            if (response.status === 422) {
                $scope.errors = response.data.errors;
                angular.forEach($scope.errors || {}, function (errors, field) {
                    $scope.form[field].$setValidity("server", false);
                });
            }
        };

        $scope.save = function () {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                $scope.submitting = true;
                User.update($scope.user, success, error);
            }
        };

        $scope.initialize();
    });
