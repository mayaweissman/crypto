/// <reference path="jquery-3.4.1.js" />

"use strict";

$(function () {

    //List of user's coins
    let coinsOfUser = [];
    //Export array for other pages
    window.getGlobalArray = function () {
        return coinsOfUser;
    }


    //Dropdown display's function
    function displayCoinsArray() {
        let html = "";
        let index = 0;
        if (index <= coinsOfUser.length) {
            for (const coin of coinsOfUser) {
                const div = `
            <p>${coinsOfUser[index]}</p>
            `
                index++
                html += div;
            }
        }
        $(".dropdown-content").html(html);
    }

    //Hiding progress ghyps
    $("#mainProgress").hide();
    $("#moreInfoprogress").hide();




    //Loading list of 100 coins from ajax function
    $(document).on("click", "#homeLink", async function () {
        try {
            //User switched between Reports to Home pages case
            $("#chartContainer").hide();
            $("#contentDiv").show();
            $("#mainProgress").show();
            $("#contentDiv").empty();
            const coinsList = await getCoins();
            showCoinsInfo(coinsList);
            displayChosenCoin();

        }

        catch (err) {
            alert(err);
        }

        finally {
            $("#mainProgress").hide();
        }

    });


    //Display toggles on function
    function displayChosenCoin() {
        $(".mainCard > .toggle").addClass("off");
        $(".mainCard > .toggle>input").prop("checked", false);
        for (const chosenCoin of coinsOfUser) {
            $(`#divOf${chosenCoin}>div`).removeClass("off");
            $(`#toggle${chosenCoin}`).prop("checked", true);

        }
        displayCoinsArray();
    }

    //Display coins array function
    async function showCoinsInfo(coinsArray) {
        try {
            $("#moreInfoProgress").show();
            let html = "";

            for (const coin of coinsArray) {
                if (coinsArray.indexOf(coin) < 100) {
                    const div = `<div class="col-12 col-md-4 coinDiv">
                    <div class="text-left card mainCard" id="divOf${coin.symbol}">
                    <h5 class="card-title">${coin.symbol}</h5>
                    <input type="checkbox" class="toggles checkBox" id="toggle${coin.symbol}" data-toggle="toggle" data-onstyle="success" data-style="ios" data-size="xs">
                    <span class="card-text">${coin.id}</span>
                    <p></br>
                    <button class="moreInfoButton btn btn-outline-dark btn-sm" id="${coin.id}" data-toggle="collapse" data-target="#outCollapse${coin.id}"aria-expanded="false" aria-controls="#multiCollapse${coin.symbol}">More info</button>
                    </p>
                    <div class="collapse colArea" id="outCollapse${coin.id}">
                    <div class="insideCollapse" id="multiCollapse${coin.id}">
                    <img src="/assets/images/loader.gif" width="15%" id="moreInfoProgress">
                    </div>
                    </div>
                    </div>
                    </div>`;
                    html += div;

                }
            }

            $("#contentDiv").append(html);
            $(`input[type="checkbox"]`).bootstrapToggle();

        }

        catch (err) {
            alert(err);
        }

        finally {
            $("#moreInfoProgress").hide();
        }

    }



    //Toggled validation
    $(document).on("click", ".toggle", function () {
        const coinIdByUser = $(this).children("input").attr("id");
        //User turn coin's toggle off case
        if ($(this).hasClass(`off`)) {
            if (coinIdByUser.includes("toggle")) {
                const fixedCoinIdByUser = coinIdByUser.replace("toggle", "");
                const toggleIndex = coinsOfUser.indexOf(fixedCoinIdByUser);
                coinsOfUser.splice(toggleIndex, 1);
                displayCoinsArray();
                console.log(coinsOfUser);
            }

            else if (coinIdByUser.includes("inside")) {
                const fixedCoinIdByUser = coinIdByUser.replace("inside", "");
                const toggleIndex = coinsOfUser.indexOf(fixedCoinIdByUser);
                coinsOfUser.splice(toggleIndex, 1);
                displayCoinsArray();
                console.log(coinsOfUser);
            }

        }

        else {
            const coinIdByUser = $(this).children("input").attr("id");
            const fixedStrCoin = coinIdByUser.replace("toggle", "")

            //User makes array over 5 coins case

            if (coinsOfUser.length >= 5) {
                coinsOfUser.push(fixedStrCoin);
                displayCoinsArray();

                const modalContent = getCoinsToRemove();
                $("#modalDiv").html(modalContent);
                $("#exampleModal").modal("show");
                $(`input[type="checkbox"]`).bootstrapToggle();
                for (const coin of coinsOfUser) {
                    console.log(coin);
                    $(`#divOf${coin}>div`).removeClass("off");
                }

            }

            else {
                const fixedStrCoin = coinIdByUser.replace("toggle", "")
                coinsOfUser.push(fixedStrCoin);
                displayCoinsArray();

            }
        }

    });

    $("#searchButton").click(async function () {
        try {
            $("#mainProgress").show();
            $("#searchBox").css("background-color", "");
            const val = $("#searchBox").val();
            if (val === "") {
                alert("Please Enter a coin ID");
                $("#searchBox").css("background-color", "pink");
            }
            else {
                let coinById = await getCoinByID(val);
                console.log(coinById);
                $("#contentDiv").empty();
                let html = `<div class="col-12 col-md-4">
                <div class="text-left card mainCard" id="divOf${coinById.symbol}">
                <h5 class="card-title">${coinById.symbol}</h5>
                <input type="checkbox" class="toggles checkBox" id="toggle${coinById.symbol}" data-toggle="toggle" data-onstyle="success" data-style="ios" data-size="xs">
                <span class="card-text">${coinById.id}</span>
                <p>
                <button class="moreInfoButton btn btn-secondary btn-sm" id="${coinById.id}" data-toggle="collapse" data-target="#outCollapse${coinById.id}"aria-expanded="false" aria-controls="#multiCollapse${coinById.symbol}">More info</button>
                </p>
                <div class="collapse colArea" id="outCollapse${coinById.id}">
                <div class="insideCollapse" id="multiCollapse${coinById.id}">
                <img src="/assets/images/loader.gif" width="15%" id="moreInfoProgress">
                </div>
                </div>
                </div>
                </div>`;
                $("#contentDiv").append(html);
                $(`input[type="checkbox"]`).bootstrapToggle();

            }
        }

        catch (err) {
            alert("Please enter a legal coin ID. Error:" + err);
        }
        finally {
            $("#mainProgress").hide();

        }

    })
    //Modal has been opened when array over 5 function
    function getCoinsToRemove() {
        console.log(coinsOfUser);
        const html = `
    
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Coins list can't be over 5.<br>
        Please choose coin to remove.</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="modal-body" id="insideModalDiv">
        <div class="modalToggleDiv" id="modelToggleDiv${coinsOfUser[0]}">
        <h5>${coinsOfUser[0].replace("toggle", "")}<h5>
        <input type="checkbox" checked id="inside${coinsOfUser[0]}" data-toggle="toggle" data-onstyle="success" data-style="ios" data-size="xs">
        </div>    
        <div class="modalToggleDiv" id="modelToggleDiv${coinsOfUser[1]}">
        <h5>${coinsOfUser[1].replace("toggle", "")}<h5>
        <input type="checkbox" checked id="inside${coinsOfUser[1]}" data-toggle="toggle" data-onstyle="success" data-style="ios" data-size="xs">
        </div>    
        <div class="modalToggleDiv" id="modelToggleDiv${coinsOfUser[2]}">
        <h5>${coinsOfUser[2].replace("toggle", "")}<h5>
        <input type="checkbox" checked id="inside${coinsOfUser[2]}" data-toggle="toggle" data-onstyle="success" data-style="ios" data-size="xs">
        </div>    
        <div class="modalToggleDiv" id="modelToggleDiv${coinsOfUser[3]}">
        <h5>${coinsOfUser[3].replace("toggle", "")}<h5>
        <input type="checkbox" checked id="inside${coinsOfUser[3]}" data-toggle="toggle" data-onstyle="success" data-style="ios" data-size="xs">
        </div>    
        <div class="modalToggleDiv" id="modelToggleDiv${coinsOfUser[4]}">
        <h5>${coinsOfUser[4].replace("toggle", "")}<h5>
        <input type="checkbox" checked id="inside${coinsOfUser[4]}" data-toggle="toggle" data-onstyle="success" data-style="ios" data-size="xs">
        </div>    
        <div class="modalToggleDiv" id="modelToggleDiv${coinsOfUser[5]}">
        <h5>${coinsOfUser[5].replace("toggle", "")}<h5>
        <input type="checkbox" checked id="inside${coinsOfUser[5]}" data-toggle="toggle" data-onstyle="success" data-style="ios" data-size="xs">
        </div>    
        </div>
        <div class="modal-footer">
        <button type="button" id="cancelButton" class="btn btn-danger" data-dismiss="modal">Cancel</button>
        <button type="button" id="saveChangesButton" class="btn btn-dark">Save changes</button>
        </div>
        </div>
        
        </div>
        </div>
        </div>`;

        return html;
    }


    //After canceled modal function
    $(document).on("click", "#cancelButton", function () {
        coinsOfUser.splice(5, 1);
        displayChosenCoin();
        console.log("After cancel: " + coinsOfUser);

    });

    //After saving modal changes function
    $(document).on("click", "#saveChangesButton", function () {
        if (coinsOfUser.length > 5) {
            alert("Please choose coin to remove before save changes");
            return;
        }

        else {
            displayChosenCoin();
            $("#exampleModal").modal("hide");
            console.log(coinsOfUser);
        }
    });


    //After closing modal function
    $(document).on("click", ".close", function () {
        coinsOfUser.splice(5, 1);
        displayChosenCoin();
        console.log("After cancel: " + coinsOfUser);
    });


    //Getting coins list by ajax
    function getCoins() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "https://api.coingecko.com/api/v3/coins/list",
                error: err => reject(err),
                success: coins => resolve(coins),
            });
        });
    }


    //Get specipic coin info by ajax
    function getCoinByID(id) {

        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://api.coingecko.com/api/v3/coins/${id}`,
                error: err => reject(err),
                success: coin => resolve(coin),
            });
        });


    }


    //


    //Display more info of a coin by click
    $(document).on(`click`, `.moreInfoButton`, async function () {
        try {
            $("#moreInfoProgress").show();
            const coinId = this.id;
            const maxTimeToload = 120000;
            let currentTime = Date.now();
            const coinInfoFromLocalStorage = localStorage.getItem(`${coinId}`);
            if ((coinInfoFromLocalStorage !== null) && (maxTimeToload > currentTime - coinInfoFromLocalStorage.settingTime)) {
                const html = `<div class="card card-body">
                <img src="${coinInfoFromLocalStorage.image.small} heigt="35px" width="35px">
                <br>
                <span>USD: ${coinInfoFromLocalStorage.market_data.current_price.usd} &#36;</span>
                <span>EUR: ${coinInfoFromLocalStorage.market_data.current_price.eur} &#128;</span>
                <span>ILS: ${coinInfoFromLocalStorage.market_data.current_price.ils} &#8362;</span>
                </div>`;
                $(`#multiCollapse${this.id}`).html(html);
            }

            else {
                const coinObj = await getCoinByID(coinId);
                coinObj.settingTime = Date.now();
                localStorage.setItem(`${coinId}`, JSON.stringify(coinObj));
                const html = `<div class="card card-body">
                <img src="${coinObj.image.small} heigt="35px" width="35px">
                <br>
                <span>USD: ${coinObj.market_data.current_price.usd} &#36;</span>
                <span>EUR: ${coinObj.market_data.current_price.eur} &#128;</span>
                <span>ILS: ${coinObj.market_data.current_price.ils} &#8362;</span>
                </div>`;
                $(`#multiCollapse${this.id}`).html(html);
            }



        }

        catch (err) {
            alert(JSON.stringify(err));
        }

        finally {
            $("#moreInfoProgress").hide();

        }


    })

});
