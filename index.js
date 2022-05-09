const $ = (selector) => document.querySelector(selector);
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
    // console.log(dateData);

    //---------------------------------------------------------

    //입출금내역 렌더링
    const dwHistory = (a) =>
        a
            .map((view) => {
                if (view.income === "in") {
                    return `
                    <div class='detail-expense'>
                    <span>${view.history}</span>
                    <span class='styledText'>+ ${view.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span>
                    </div>
                    `;
                } else {
                    return `
                    <div class='detail-expense'>
                    <span>${view.history}</span>
                    <span>${view.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span>
                    </div>
                    `;
                }
            })
            .join("");

    //총합과 지출, 수입 render
    const sum = (a) => {
        let count = 0;
        a.map((b) => {
            if (b.income === "out") {
                count = count - b.price;
            } else if (b.income === "in") {
                count = count + b.price;
            }
        });
        //만약 count가 양수면 `count 수입` 음수면 `count 지출`
        return count > 0 ? `${count}원 수입` : `${Math.abs(count)}원 지출`;
    };

    //오늘, 어제, 2일 전 render
    const dayCalcul = (a) => {
        if (a.date === dateString) {
            return "오늘";
        } else if (Math.abs(today - new Date(a.date)) / (1000 * 3600 * 24) === 1) {
            return "어제";
        } else if (Math.abs(today - new Date(a.date)) / (1000 * 3600 * 24) === 2) {
            return "2일 전";
        } else {
            return a.date;
        }
    };

    function render() {
        const template = dateData
            .reverse()
            .map((obj) => {
                if (obj.date <= dateString) {
                    return `
                    <div class="expenses">
                    <div class="date">
                    <p class="date-left">${dayCalcul(obj)}</p>
                    <p class="date-right">${sum(obj.data)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>
                    <div class="detail-expenses"> 
                    ${dwHistory(obj.data)}
                    </div>
                    </div>`;
                }
            })
            .join("");
        $(".expenses-list").innerHTML = template;
    }
    render();
    console.log(today);
}
App();
