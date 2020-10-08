/// <reference path="jquery-3.4.1.js" />

"use strict";

$(function () {
    // const coinsOfUser = ["BTC" , "ACOIN"];

    let dataForCharts = [null, null, null, null, null]

    $("#reportsLink").click(async function () {
        try {
            $("#mainProgress").show();
            $("#chartContainer").show();
            $("#contentDiv").hide();
            chart();
            let coinsOfUser = getGlobalArray();
            if (coinsOfUser.length === 0) {
                $("#chartContainer").html(`<h3 id="emptyReportsTitle">Please choose at least one coin at home page to display live reports<h3>`);
            }
            await getChart(coinsOfUser).then(coinChart => {
                let index = 0;
                console.log(coinChart)
                for (let coin in coinChart) {
                    const priceUSD = coinChart[coin].USD
                    dataForCharts.splice(index, 1, priceUSD)
                    index++
                    console.log(dataForCharts);
                }
            });
        }
        catch (err) {
            alert(err);

        }
        finally{
            $("#mainProgress").hide();

        }
    });


    async function chart() {

        let data1 = [{ y: dataForCharts[0] }];
        let data2 = [{ y: dataForCharts[1] }];
        let data3 = [{ y: dataForCharts[2] }];
        let data4 = [{ y: dataForCharts[3] }];
        let data5 = [{ y: dataForCharts[4] }];
        let chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: "Dynamic Data"
            },
            data: [{
                type: "spline",
                dataPoints: data1
            },
            {
                type: "spline",
                dataPoints: data2
            },
            {
                type: "spline",
                dataPoints: data3
            },
            {
                type: "spline",
                dataPoints: data4
            },
            {
                type: "spline",
                dataPoints: data5
            }
            ]
        });

        chart.render();

        let updateCount = 0;
        let updateChart = function () {

            updateCount++;

            data1.push({
                y: dataForCharts[0]
            });
            data2.push({
                y: dataForCharts[1]
            });
            data3.push({
                y: dataForCharts[2]
            });
            data4.push({
                y: dataForCharts[3]
            });
            data5.push({
                y: dataForCharts[4]
            });

            chart.options.title.text = "Update " + updateCount;
            chart.render();

        };
        setInterval(function () { updateChart() }, 1000);

    }

    function getChart(coinsList) {
        return new Promise((resolve, reject) => {
            let partOfUrl = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=";
            for (const coin of coinsList) {
                partOfUrl += coin + ",";
            }
            $.ajax({
                url: `${partOfUrl}&tsyms=USD`,
                error: err => reject(err),
                success: coinsData => resolve(coinsData),
            });
        })
    }

});