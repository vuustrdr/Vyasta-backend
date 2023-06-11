class VenueInfoDto {
    constructor(venueAlias, displayName, numberEmployees, constantDevices, customerDeviceAverage, maxCapacity, times) {
        this.venueAlias = venueAlias;
        this.displayName = displayName;
        this.numberEmployees = numberEmployees;
        this.constantDevices = constantDevices;
        this.customerDeviceAverage = customerDeviceAverage;
        this.maxCapacity = maxCapacity;
        this.times = times;
    }   
}

module.exports = VenueInfoDto;