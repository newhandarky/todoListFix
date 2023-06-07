import scss from "./todo.scss";

// 抓dom元素
const input = document.querySelector("input");
const btn_add = document.querySelector(".btn_add");
const list = document.querySelector(".list");
const tabs = document.querySelector(".tab");
const notOver = document.querySelector("p");
const list_footer = document.querySelector(".list_footer");

let todoArray = [];

// 新增待辦事項點擊事件
btn_add.addEventListener("click", function (e) {
    let todoObject = {
        isOver: false,
        inputValue: ""
    };

    if (input.value.trim() === "") {
        Swal.fire("請輸入待辦事項");
        return;
    } else if (e.target.getAttribute("class") === "btn_add") {
        todoObject.inputValue = input.value;
        todoArray.push(todoObject);
        showLists(todoArray);
    };
    input.value = "";
});

// 渲染事項
let showLists = function (lists) {
    let str = "";
    let isOverCount = 0;

    lists.forEach(function (item, index) {
        if (item.isOver == true) {
            // tabs在"待完成"之下新增不會顯示已完成的項目
            if (document.querySelector(".active").innerHTML == "待完成") {
                str += ` <li class=showTodo>
                <label class="checkbox" for="">
                <input type="checkbox" data-inputIndex="${index}" checked/>
                <span>${item.inputValue}</span>
                </label>
                <a href="#" data-deleteIndex="${index}" class="delete"></a>
                </li>`;
            } else {
                str += ` <li>
                <label class="checkbox" for="">
                <input type="checkbox" data-inputIndex="${index}" checked/>
                <span>${item.inputValue}</span>
                </label>
                <a href="#" data-deleteIndex="${index}" class="delete"></a>
                </li>`;
            }
        } else {
            // tabs在"已完成"之下新增不會顯示待完成的項目
            if (document.querySelector(".active").innerHTML == "已完成") {
                str += ` <li class="showTodo">
                <label class="checkbox" for="">
                <input type="checkbox" data-inputIndex="${index}"/>
                <span>${item.inputValue}</span>
                </label>
                <a href="#" data-deleteIndex="${index}" class="delete"></a>
                </li>`;
                isOverCount++;
            } else {
                str += ` <li>
                <label class="checkbox" for="">
                <input type="checkbox" data-inputIndex="${index}"/>
                <span>${item.inputValue}</span>
                </label>
                <a href="#" data-deleteIndex="${index}" class="delete"></a>
                </li>`;
                isOverCount++;
            }
        }
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

    // teb顯示切換
    if (e.target.innerHTML === "全部") {
        document.querySelectorAll(".showTodo").forEach(function (item) {
            item.setAttribute("class", "");
        })
    } else if (e.target.innerHTML === "待完成") {
        todoArray.forEach(function (item, index) {
            if (item.isOver == false) {
                list.children[index].setAttribute("class", "");
            } else {
                list.children[index].setAttribute("class", "showTodo");
            }
        })
    } else if (e.target.innerHTML === "已完成") {
        todoArray.forEach(function (item, index) {
            if (item.isOver == true) {
                list.children[index].setAttribute("class", "");
            } else {
                list.children[index].setAttribute("class", "showTodo");
            }
        })
    }
});

// 修改事項完成狀態與計數
list.addEventListener("click", function (e) {
    if (e.target.nodeName === "INPUT") {
        let overTodoNum = e.target.getAttribute("data-inputIndex");
        let isOverCount = 0;
        // 切換isOver狀態, 確認是否完成事項
        todoArray[overTodoNum].isOver = !todoArray[overTodoNum].isOver;
        todoArray.forEach(function (item) {
            if (item.isOver == false) {
                isOverCount++;
            }
        })
        notOver.innerHTML = `${isOverCount} 個待完成項目`;

        // teb在待完成或是已完成的狀態下修改狀態同時修改隱藏顯示
        if (document.querySelector(".active").innerHTML == "已完成") {
            list.children[overTodoNum].setAttribute("class", "showTodo");
        } else if (document.querySelector(".active").innerHTML == "待完成") {
            list.children[overTodoNum].setAttribute("class", "showTodo");
        }

        // 點擊刪除
    } else if (e.target.getAttribute("class") === "delete") {
        let deleteInex = e.target.getAttribute("data-deleteIndex");
        if (todoArray[deleteInex].isOver == false) {
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
    console.log(e.target.nodeName);
    let deleteArr = [];
    if (e.target.nodeName == "A") {
        todoArray.forEach(function (item, index) {
            if (item.isOver == true) {
                deleteArr.push(index);
            }
        });
        // 確認是否有已完成事項
        if(deleteArr.length == 0){
            Swal.fire("目前尚未有已完成事項");
        }else{
            Swal.fire({
                title: '您確定要刪除全部已完成事項嗎?',
                showCancelButton: true,
                confirmButtonText: '確定'
            }).then((result) => {
                if (result.isConfirmed) {
                    todoArray = todoArray.filter(function (item) {
                        if (item.isOver == false) {
                            return item;
                        }
                    })
                    showLists(todoArray);
                    Swal.fire('完成事項皆已刪除', '', 'success')
                } 
            })
        }
    }
})