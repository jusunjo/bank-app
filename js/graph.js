let todayNow = new Date();
let year = todayNow.getFullYear();
let month = ("0" + (todayNow.getMonth() + 1)).slice(-2);
let day = ("0" + todayNow.getDate()).slice(-2);
let dateString = year + "-" + month + "-" + day;

let today = new Date(dateString);

async function App() {
    const getData = await axios.get("https://raw.githubusercontent.com/jusunjo/bank-json/main/bank.json");
    const priceValues = getData.data.reduce((acc, current) => {
        acc[current.date] = acc[current.date] || [];
        acc[current.date].push(current);
        return acc;
    }, {});
    const dateData = Object.keys(priceValues).map((key) => {
        return {
            date: key,
            data: priceValues[key],
        };
    });

    console.log(dateData);

    const getDate = [];

    dateData.map((dt) => {
        if (dt.date <= dateString) {
            return getDate.push(dt);
        }
    });

    console.log(getDate);
    let arr = [];
    getDate.map((obj) => {
        let count = 0;
        obj.data.map((num) => {
            if (num.income === "out") {
                count = count + num.price;
            }
        });
        return arr.push(count);
    });

    //bar,line chart
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
        data: {
            datasets: [
                {
                    type: "bar",
                    label: "bar Dataset",
                    data: arr,
                    backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
                },
            ],
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
        },
    });

    let oiling = 0;
    let health = 0;
    let mart = 0;
    let eatout = 0;
    let shopping = 0;
    getDate.map((obj) => {
        obj.data.map((dt) => {
            if (dt.classify === "oiling") {
                oiling += dt.price;
            } else if (dt.classify === "health") {
                health += dt.price;
            } else if (dt.classify === "mart") {
                mart += dt.price;
            } else if (dt.classify === "eatout") {
                eatout += dt.price;
            } else if (dt.classify === "shopping") {
                shopping += dt.price;
            }
        });
    });
    let renderArr = [oiling, health, mart, eatout, shopping];

    const totalValue = renderArr.reduce((acc, cur) => {
        return (acc += cur);
    });

    console.log(totalValue);

    const donut = document.getElementById("donutChart").getContext("2d");
    new Chart(donut, {
        type: "doughnut",
        data: {
            labels: ["주유비", "건강관리비", "장보기", "외식비", "상점"],
            datasets: [
                {
                    data: renderArr,
                    backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)", "rgb(255, 105, 86)", "rgb(25, 55, 86)"],
                    hoverOffset: 4,
                },
            ],
        },
    });

    document.querySelector(".topfive-expends").innerHTML = `
        <div class="topfive-expend">
            <img class="topfive-img" src="/img/car.png" />
            <p class="expend-name">주유비</p>
            <p class="expend-price">${oiling.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
        </div>
        <div class="topfive-expend">
            <img class="topfive-img" src="/img/health.png" />
            <p class="expend-name">건강관리비</p>
            <p class="expend-price">${health.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
        </div>
        <div class="topfive-expend">
            <img class="topfive-img" src="/img/food.png" />
            <p class="expend-name">장보기</p>
            <p class="expend-price">${mart.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
        </div>
        <div class="topfive-expend">
            <img class="topfive-img" src="/img/shopping.png" />
            <p class="expend-name">외식비</p>
            <p class="expend-price">${eatout.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
        </div>
        <div class="topfive-expend">
            <img class="topfive-img" src="/img/shop.png" />
            <p class="expend-name">상점</p>
            <p class="expend-price">${shopping.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
        </div>
    `;

    document.querySelector(".rel").insertAdjacentHTML("afterbegin", `<p class ='totalValue'>${totalValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>`);
}

App();
