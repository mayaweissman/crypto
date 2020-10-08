/// <reference path="jquery-3.4.1.js" />

"use strict";

$(function () {

    $("#aboutLink").click(function () {
        $("#contentDiv").show();
        $("#contentDiv").empty();
        $("#chartContainer").hide();

        let html = `
        <div class="text-left card" id="aboutMainDiv">
        <div class="col-12" id="aboutWebDiv">
        <h5>About Crypto:</h5>
            <p> Crypto website was made in the goal of helping you track digital coins in real time.</p>
            <p>With "Crypto" you can always stay updated with the changing currency of different coins,</br>
             and track it while comparing to stock coins such as USD EUR and ILS.</p>
             <p>To make it even easier, we created a page called "Real time reports" to visually present you with 
             the changing currency of 5 coins of your choice every 2 seconds.</p>
             <p>
             </div>
             <div class="col-12" id="aboutDeveloperDiv">
             <h5>About the developer:</h5>
             Maya Weissman is a junior developer,<br/>
             Witch have a well-developed aesthetic sense
              and both analytical and systemic thinking.<br/>
              Maya started her way as a developer in "Jhon bryce",<br/>
              and trough that she discovered her love and passion for the profession.

             </p>
             </div>
             <div class="col-12 col-md-6" id="aboutImageDiv">
             <img src="/assets/images/imageedit_4_6878918072.gif" id="aboutImg">
            </div>
            </div>
            `;
        $("#contentDiv").append(html);
    });

});