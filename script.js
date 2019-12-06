let add_but = document.getElementById('create');
let task_inp = document.getElementById('task');
let task_list = document.getElementById('list');
let done_list = document.getElementById('done');


// Створення нової задачі
function create_el (task, done){
    let listItem = document.createElement('li');

    // Перевірка чи вона виконана (при генеруванні з localStorage)
    var check = document.createElement('button');
    if (done){
        check.className = "checkbox";
        check.innerHTML = "<i class='fas fa-check-circle'></i>";
    } else{
        check.className = "checkbox";
        check.innerHTML = "<i class='far fa-check-circle'></i>";
    }
    

    let p = document.createElement('p');
    p.innerText=task;
    let input = document.createElement('input');
    input.type = "text";
    input.value=task;

    let edit = document.createElement('button');
    edit.className = "edit";
    edit.innerHTML = "<i class='fas fa-pencil-alt'></i>";

    let del = document.createElement('button');
    del.className = "delete";
    del.innerHTML = "<i class='fas fa-trash'></i>";

    listItem.appendChild(check);
    listItem.appendChild(p);
    listItem.appendChild(input);
    listItem.appendChild(edit);
    listItem.appendChild(del);

    return listItem;
}

// Додання нової задачі
function Add(){
    if(task_inp.value){
        let listItem=create_el(task_inp.value);
        task_list.appendChild(listItem);
        bind_events(listItem, done_task);
        task_inp.value="";
    }
    save_data();
}

add_but.onclick= Add;

// Видалення задачі
function del_task (){
    let list_item = this.parentNode;
    let ul = list_item.parentNode;
    ul.removeChild(list_item);

    save_data();
}

// Виконані/не виконані задачі
function done_task (){
    let list_item=this.parentNode;
    let check = list_item.querySelector('button.checkbox');
    check.className = "checkbox nav_all";
    check.innerHTML = "<i class='fas fa-check-circle'></i>";

    done_list.appendChild(list_item);
    bind_events(list_item, not_done_task);
    save_data();
}

function not_done_task (){
    let list_item=this.parentNode;
    let check = list_item.querySelector('button.checkbox');
    check.className = "checkbox nav_all";
    check.innerHTML = "<i class='far fa-check-circle'></i>";

    task_list.appendChild(list_item);
    bind_events(list_item, done_task);
    save_data();
}

//Редагування назви
function edit_task (){
    let edit = this;
    let list_item=this.parentNode;
    let p = list_item.querySelector('p');
    let input = list_item.querySelector('input[type=text]');

    let cont_class=list_item.classList.contains('editMode');

    if(cont_class){
         p.innerText=input.value;
         save_data();
    } else {
        p.value = p.innerText
    }

    list_item.classList.toggle('editMode');
}

// Виклики певних фунцій при натисканні відповідних кнопок
function bind_events(listItem, event){
    let del = listItem.querySelector('button.delete');
    let edit = listItem.querySelector('button.edit');
    let check = listItem.querySelector('button.checkbox')

    check.onclick = event;
    del.onclick=del_task;
    edit.onclick = edit_task;
}

// Зберігання даних до localStorage
function save_data (){
    let not_done_arr = [];
    for (let i = 0; i < task_list.children.length; i++){
        not_done_arr.push(task_list.children[i].getElementsByTagName('p')[0].innerText);
    }


    let done_arr = [];
    for (let i = 0; i < done_list.children.length; i++){
        done_arr.push(done_list.children[i].getElementsByTagName('p')[0].innerText);
    }

    localStorage.removeItem('to-do');

    localStorage.setItem('to-do', JSON.stringify({task_list: not_done_arr, done_list: done_arr}));
}

// Завантаження даних з localStorage
function load(){
    return JSON.parse(localStorage.getItem('to-do'));
}

let data = load();
for (var i=0; i<data.task_list.length; i++){
    let list_item=create_el(data.task_list[i], false);
    task_list.appendChild(list_item);
    bind_events(list_item, done_task);
}

for (var i=0; i<data.done_list.length; i++){
    let list_item=create_el(data.done_list[i], true);
    done_list.appendChild(list_item);
    bind_events(list_item, not_done_task);
}