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

    residuals(new_cases, total_deaths, new_deaths, total_recovered, active_cases) {
        this.dif_cases = parseInt(this.new_cases) - parseInt(new_cases);
        this.dif_total_deaths = parseInt(this.total_deaths) - parseInt(total_deaths);
        this.dif_new_deaths = parseInt(this.new_deaths) - parseInt(new_deaths);
        this.dif_total_recovered = parseInt(this.total_recovered) - parseInt(total_recovered); 
        this.dif_active_cases = parseInt(this.active_cases) - parseInt(active_cases);
    }

    get displayDefault() {
        return `${this.name.bold()}:
        New infected - ${this.new_cases.bold()} (+${this.dif_cases})
        Died - ${this.total_deaths.bold()} (+${this.dif_new_deaths})
        Recovered - ${this.total_recovered.bold()} (+${this.dif_total_recovered})
        Infected now - ${this.active_cases.bold()} (+${this.dif_active_cases})
--------------------------------------------------------------------\n`.italics();
    }

    get displaySingleCountryFull() {
        return `${this.name.bold()}:
        New infected - ${this.new_cases.bold()} (+${this.dif_cases})
        New deaths - ${this.new_deaths.bold()} (+${this.dif_new_deaths})
        Died - ${this.total_deaths.bold()} (+${this.dif_total_deaths})
        Recovered - ${this.total_recovered.bold()} (+${this.dif_total_recovered})
        Infected now - ${this.active_cases.bold()} (+${this.dif_active_cases})
--------------------------------------------------------------------\n`.italics();
    } 

    get getName() {
        return this.name;
    }
    
}

Country.countries = ['Ukraine', 'Germany', 'Russia'];

module.exports = Country;