'use strict';

/**
 * Source: https://github.com/DmitryEfimenko/ngAutocomplete
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Full Example:
 * <input type="text" ng-model="details.formattedAddress" ng-autocomplete details="details" options="options" validate-fn="customValidate()" />
 *
 * creates the autocomplete text box
 *
 *   Required attributes
 *   [ng-autocomplete]: Specifies the directive
 *   [ng-model]: Set initial value for the textbox
 *   [details]: Specifies result object which is a bit flattened "google place" object, where properties will be set to the address types.
 *              For more info about google types, see: https://developers.google.com/maps/documentation/geocoding/#Types
 *
 *   Optional attributes
 *   [options]: Options provided by the user that filter the autocomplete results
 *
 *       options = {
 *           types: type,        string, values can be 'geocode', 'establishment', '(regions)', or '(cities)'
 *           bounds: bounds,     google maps LatLngBounds Object
 *           country: country    string, ISO 3166-1 Alpha-2 compatible country code. examples; 'ca', 'us', 'gb'
 *       }
 *
 *   [validate-fn]: allows to add any custom validation logic to run upon an address is selected from the list of suggestions
 *
 *   IMPORTANT!
 *   You must declare $scope.details = {}; in the controller
 */

angular.module("ngAutocomplete", [])
    .directive('ngAutocomplete', ['$parse',
        function ($parse) {

            function convertPlaceToFriendlyObject(place) {
                var result = undefined;
                if (place) {
                    result = {};
                    for (var i = 0, l = place.address_components.length; i < l; i++) {
                        if (i == 0) {
                            result.searchedBy = place.address_components[i].types[0];
                        }
                        result[place.address_components[i].types[0]] = place.address_components[i].long_name;
                    }
                    result.formattedAddress = place.formatted_address;
                    result.lat = place.geometry.location.lat();
                    result.lng = place.geometry.location.lng();
                }
                return result;
            }

            return {
                restrict: 'A',
                require: 'ngModel',
                link: function ($scope, $element, $attrs, $ctrl) {

                    if (!angular.isDefined($attrs.details)) {
                        throw '<ng-autocomplete> must have attribute [details] assigned to store full address object';
                    }

                    var getDetails = $parse($attrs.details);
                    var setDetails = getDetails.assign;
                    var getOptions = $parse($attrs.options);

                    //options for autocomplete
                    var opts;

                    //convert options provided to opts
                    var initOpts = function () {
                        opts = {};
                        if (angular.isDefined($attrs.options)) {
                            var options = getOptions($scope);
                            if (options.types) {
                                opts.types = [];
                                opts.types.push(options.types);
                            }
                            if (options.bounds) {
                                opts.bounds = options.bounds;
                            }
                            if (options.country) {
                                opts.componentRestrictions = {
                                    country: options.country
                                };
                            }
                        }
                    };

                    //create new autocomplete
                    //reinitializes on every change of the options provided
                    var newAutocomplete = function () {
                        var gPlace = new google.maps.places.Autocomplete($element[0], opts);
                        google.maps.event.addListener(gPlace, 'place_changed', function () {
                            $scope.$apply(function () {
                                var place = gPlace.getPlace();
                                var details = convertPlaceToFriendlyObject(place);
                                setDetails($scope, details);
                                $ctrl.$setViewValue(details.formattedAddress);
                                $ctrl.$validate();
                            });
                            if ($ctrl.$valid && angular.isDefined($attrs.validateFn)) {
                                $scope.$apply(function () {
                                    $scope.$eval($attrs.validateFn);
                                });
                            }
                        });
                    };
                    newAutocomplete();

                    $ctrl.$validators.parse = function (value) {
                        var details = getDetails($scope);
                        var valid = ($attrs.required == true && details != undefined && details.lat != undefined) ||
                            (!$attrs.required && (details == undefined || details.lat == undefined) && $element.val() != '');
                        return valid;
                    };

                    $element.on('keypress', function (e) {
                        // prevent form submission on pressing Enter as there could be more inputs to fill out
                        if (e.which == 13) {
                            e.preventDefault();
                        }
                    });

                    //watch options provided to directive
                    if (angular.isDefined($attrs.options)) {
                        $scope.$watch($attrs.options, function() {
                            initOpts();
                            newAutocomplete();
                        });
                    }

                    // user typed something in the input - means an intention to change address, which is why
                    // we need to null out all fields for fresh validation
                    $element.on('keyup', function (e) {
                        //          chars 0-9, a-z                        numpad 0-9                   backspace         delete           space
                        if ((e.which >= 48 && e.which <= 90) || (e.which >= 96 && e.which <= 105) || e.which == 8 || e.which == 46 || e.which == 32) {
                            var details = getDetails($scope);
                            if (details != undefined) {
                                for (var property in details) {
                                    if (details.hasOwnProperty(property) && property != 'formattedAddress') {
                                        delete details[property];
                                    }
                                }
                                setDetails($scope, details);
                            }
                            if ($ctrl.$valid) {
                                $scope.$apply(function () {
                                    $ctrl.$setValidity('parse', false);
                                });
                            }
                        }
                    });
                }
            };
        }
    ]);
