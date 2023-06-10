import scss from "./todo.scss";

// 抓dom元素
const input = document.querySelector("input");
const btn_add = document.querySelector(".btn_add");
const list = document.querySelector(".list");
const tabs = document.querySelector(".tab");
const notOver = document.querySelector("p");
const list_footer = document.querySelector(".list_footer");
// 建立準備儲存待辦事項的陣列
const todoArray = [];

// 新增待辦事項點擊事件
btn_add.addEventListener("click", function (e) {
    // 自訂待辦事項內容
    const todoObject = {
        isOver: false,
        inputValue: ""
    };
    // 判斷輸入事項欄位是否為空值
    if (input.value.trim() === "") {
        Swal.fire("請輸入待辦事項");
        return;
    } else if (e.target.getAttribute("class") === "btn_add") {
        todoObject.inputValue = input.value;
        todoArray.push(todoObject);
        showLists(todoArray);
    };
    // 新增完事件後回到"全部"以檢視內容的變更
    const activeTeb = document.querySelector(".active");
    if (activeTeb.innerText !== "全部") {
        activeTeb.classList.remove("active");
        tabs.children[0].setAttribute("class", "active");
    }
    input.value = "";
});

// 渲染事項
let showLists = function (lists) {
    let str = "";
    let isOverCount = 0;

    lists.forEach(function (item, index) {
        if (item.isOver !== true) {
            isOverCount++;
        }
        str += ` <li>
                    <label class="checkbox" for="">
                    <input type="checkbox" data-inputIndex="${index}" ${item.isOver ? "checked" : ""}/>
                    <span>${item.inputValue}</span>
                    </label>
                    <a href="#" data-deleteIndex="${index}" class="delete"></a>
                </li>`;
    });
    list.innerHTML = str;
    notOver.innerHTML = `${isOverCount} 個待完成項目`;
}

// 全部, 待完成, 已完成切換事件
tabs.addEventListener("click", function (e) {
    // 切換勾選的元素
    if (e.target.nodeName === "LI") {
        if (!e.target.classList.contains("active")) {
            document.querySelector(".active").classList.remove("active");
            e.target.classList.toggle("active");
        }
    }
})

// teb顯示切換
tabs.addEventListener("click", function (e) {
    if (e.target.innerHTML === "全部") {
        document.querySelectorAll(".showTodo").forEach(function (item) {
            item.setAttribute("class", "");
        })
    } else if (e.target.innerHTML === "待完成") {
        todoArray.forEach(function (item, index) {
            item.isOver ? list.children[index].setAttribute("class", "showTodo") : list.children[index].setAttribute("class", "")
        })
    } else if (e.target.innerHTML === "已完成") {
        todoArray.forEach(function (item, index) {
            item.isOver ? list.children[index].setAttribute("class", "") : list.children[index].setAttribute("class", "showTodo")
        })
    }
});

// 修改事項完成狀態與計數
list.addEventListener("click", function (e) {
    if (e.target.nodeName === "INPUT") {
        let overTodoNum = e.target.getAttribute("data-inputIndex");
        // 切換isOver狀態, 確認是否完成事項
        todoArray[overTodoNum].isOver = !todoArray[overTodoNum].isOver;
        // 取得尚未完成數量
        let isOverCount = todoArray.filter(todo => !todo.isOver).length;
        notOver.innerHTML = `${isOverCount} 個待完成項目`;
        // teb在待完成或是已完成的狀態下修改狀態同時修改隱藏顯示
        if (document.querySelector(".active").innerHTML === "已完成") {
            list.children[overTodoNum].setAttribute("class", "showTodo");
        } else if (document.querySelector(".active").innerHTML === "待完成") {
            list.children[overTodoNum].setAttribute("class", "showTodo");
        }
    }
})

// 點擊刪除單筆事項
list.addEventListener("click", function (e) {
    if (e.target.getAttribute("class") === "delete") {
        let deleteInex = e.target.getAttribute("data-deleteIndex");
        if (todoArray[deleteInex].isOver === false) {
            Swal.fire({
                icon: 'error',
                title: '您尚未完成此事項',
                text: '請先完成待辦事項'
            });
        } else {
            Swal.fire({
                title: '您確定要刪除此事項嗎?',
                showCancelButton: true,
                confirmButtonText: '確定'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('完成事項已刪除', '', 'success')
                    todoArray.splice(deleteInex, 1);
                    showLists(todoArray);
                }
            })
        }
    }
})

// 刪除全部事項
list_footer.addEventListener("click", function (e) {
    const deleteArr = [];
    if (e.target.nodeName !== "A") {
        return;
    }
    // 確認是否存在完成事項
    if (todoArray.find(todo => todo.isOver === true) === undefined) {
        Swal.fire("目前尚未有已完成事項");
    } else {
        Swal.fire({
            title: '您確定要刪除全部已完成事項嗎?',
            showCancelButton: true,
            confirmButtonText: '確定'
        }).then((result) => {
            if (result.isConfirmed) {
                todoArray.forEach(function(item, index){
                    if(item.isOver === true){
                        // 將已完成的事項的index新增到deleteArr的開頭
                        deleteArr.unshift(index);
                    }
                })
                deleteArr.forEach(function(item){
                    todoArray.splice(item, 1)
                })
                Swal.fire('完成事項皆已刪除', '', 'success')
                showLists(todoArray);
            }
        })
    }
})