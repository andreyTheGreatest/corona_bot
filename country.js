class Country {
    constructor(name, new_cases, total_deaths, new_deaths, total_recovered, active_cases) {
        this.name = name;
        this.new_cases = new_cases;
        this.total_deaths = total_deaths;
        this.new_deaths = new_deaths;
        this.total_recovered = total_recovered;
        this.active_cases = active_cases;
    }

    get getNewCases() { return this.new_cases; }

    get getTotalDeaths() { return this.total_deaths; }

    get getNewDeaths() { return this.new_deaths; }

    get getTotalRecovered() { return this.total_recovered; }

    get getActiveCases() { return this.active_cases; }

    get displayDefault() {
        return `${this.name.bold()}:
        New infected - ${this.new_cases.bold()}
        Died - ${this.total_deaths.bold()}
        Recovered - ${this.total_recovered.bold()}
        Infected now - ${this.active_cases.bold()}
--------------------------------------------------------------------\n`.italics();
    }

    get displaySingleCountryFull() {
        return `${this.name.bold()}:
        New infected - ${this.new_cases.bold()}
        New deaths - ${this.new_deaths.bold()}
        Died - ${this.total_deaths.bold()}
        Recovered - ${this.total_recovered.bold()}
        Infected now - ${this.active_cases.bold()}
--------------------------------------------------------------------\n`.italics();
    } 

    get getName() {
        return this.name;
    }
}

Country.countries = ['Ukraine', 'Germany', 'Russia'];

module.exports = Country;