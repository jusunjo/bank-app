const $ = (selector) => document.querySelector(selector);
let money = 0;
let todayNow = new Date();
let year = todayNow.getFullYear();
let month = ("0" + (todayNow.getMonth() + 1)).slice(-2);
let day = ("0" + todayNow.getDate()).slice(-2);
let dateString = year + "-" + month + "-" + day;
// const template = "";
async function App() {
    const getData = await axios.get("https://raw.githubusercontent.com/jusunjo/bank-json/main/bank.json");

    const aa = (fuckingData) => {
        fuckingData.map((view) => {
            return `
            <li>
            <p>${view.history}</p>
            <p>${obj.price}</p>
            </li>
            `;
        });
    };
    // console.log(getData.data);
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

    //총합 가격 렌더링
    const totalPrice = (price) =>
        price.reduce((acc, cur) => {
            return acc + cur.price;
        }, 0);

    const dwHistory = (a) =>
        a.map((view) => {
            return `
            <div class='detail-expense'>
            <span>${view.history}</span>
            <span>${view.price}원</span>
            </div>
            `;
        });

    // console.log(ex);

    console.log(dateData);

    function render() {
        const template = dateData
            .reverse()
            .map((obj) => {
                if (obj.date <= dateString)
                    return `
            <div class="expenses">
            <div class="date">
            <p class="date-left">${obj.date}</p>
            <p class="date-right">${totalPrice(obj.data)}원</p>
            </div>
            <div class="detail-expenses"> 
            ${dwHistory(obj.data)}
            </div>
            </div>`;
            })
            .join("");
        $(".expenses-list").innerHTML = template;
    }
    render();
}
App();
