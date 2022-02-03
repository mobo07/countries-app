const dropDownIcon = $("#filter-menu");
const dropDownMenu = $(".filter-drop-down");
const region = $(".region");
const theme = $("#theme");
const countriesTheme = $(".countries-theme");
const searchInput = $(".search-input");
const suggBox = $(".auto-complete-box");
const searchWrapper = $(".search-wrapper");
let countryNames = [];

$(() => {
    searchInput.val("");
    if(countryNames.length === 0) {
        $(".name").each(function() {
            countryNames.push($(this).text());
        });
    }
});

let emptyArr = [];
searchInput.keyup(e => {
    let searchValue = e.target.value;
    if(searchValue) {
        emptyArr = countryNames.filter(name => {
            return name.toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase());
        });
        emptyArr = emptyArr.map(name => {
            return name = `<li class="suggestion">${name}</li>`;
        });
        if(e.keyCode === 13) {
            searchWrapper.removeClass("active");
            if(!emptyArr.length)
            location.href = `/error`;
            else
            location.href = `/country?name=${searchValue}`;
        }
        searchWrapper.addClass("active");
    } else {
        searchWrapper.removeClass("active");
    }
    showSuggestions(emptyArr);
    let allList = $("li");
    for(let i = 0; i < allList.length; i++) {
        allList[i].setAttribute("onclick", "select(this, emptyArr)");
    }
});

const select = (elem, arr) => {
    let selectUserData = elem.textContent;
    searchInput.val(selectUserData);
    if(!arr.length)
    location.href = `/error`;
    else
    location.href = `/country?name=${selectUserData}`;
}

const showSuggestions = (list) => {
    if(!list.length) {
        userValue = searchInput.val();
        listData = `<li class="suggestion">${userValue}</li>`;
    } else {
        listData = list.join('');
    }
    suggBox.html(listData);
}

$(document).click(e => {
    if(!e.target.matches("search-input") && !e.target.matches("suggestion")){
        if(searchWrapper.hasClass("active")) 
        searchWrapper.removeClass("active");
        searchInput.val("");
    }
});

countriesTheme.click(function() {
    if(theme.attr("href") === "css/light-mode.css") {
        theme.attr("href", "css/dark-mode.css");
        $(".countries-theme").text("Light Mode");
    } 
    else{
        theme.attr("href", "css/light-mode.css");
        $(".countries-theme").text("Dark Mode");
    } 
});

dropDownIcon.click(function() {
    dropDownMenu.toggleClass("active");
});

region.click(function(e) {
    e.preventDefault();
    dropDownMenu.removeClass("active");
    const regionParam = $(this).attr("id");
    $.ajax({
        type: 'GET',
        url: `https://restcountries.com/v3.1/region/${regionParam}`,
        success: function(countries, textStatus, jqXHR) {
            $(".country-container").html("");
            countries.forEach(country => {
                let population = country.population.toLocaleString();
                $(".country-container").append(`
                            <a href="/country?name=${country.name.common}" >
                                <div class="country">
                                <div class="country-flag"><img src=${country.flags.png} alt="flag-img"/></div>
                                <div class="country-info">
                                <h3 class="country-name">${country.name.common}</h3>
                                <p><span>Population: </span>${population}</p>
                                <p><span>Region: </span>${country.region}</p>
                                <p><span>Capital: </span>${country.capital}</p></div>
                                </div></a>`);
            });
        }
    });
});

$(".back-to-home").click(function() {
    history.back();
});