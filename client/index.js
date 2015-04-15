'use strict';
/* global Firebase:true */

$(document).ready(init);

var root, user, tasks;

function init(){
  $('#set-name').click(setName);
  root = new Firebase('https://sarahjessica-todo.firebaseio.com/');
  user = root.child('user');
  tasks = root.child('tasks');
  user.on('value', userChanged);
  //when the user is changed call this function
  tasks.on('child_added', taskAdded);
  tasks.on('child_removed', taskRemoved);
  $('#create-task').click(createTask);
  $('#todos').on('click', '.delete', deleteTask);
  $('#todos').on('change', 'input[type="checkbox"]', toggleComplete);
}

// function taskChanged(){
//   //debugger;
//   if ($(this).closest('tr').hasClass('checked') === true){
//     $(this).closest('tr').removeClass('checked').addClass('unchecked');
//   }else {
//     $(this).closest('tr').removeClass('unchecked').addClass('checked');
//   }
// }

function toggleComplete(){
  var key = snapshot.key();
  var task = snapshot.val();
  var $tr = $('tr[data-key="' + key + '"]');
  var checked = task.isComplete ? 'checked' : '';
  $tr.removeClass().addClass(checked);
  $tr.find('input=[type=checkbox]').attr('checked', !!checked);
  // var key = $(this).closest('tr').data('key');
  // var checked = !!$(this).attr('checked'); // !! converts to boolean
  // tasks.child(key).update({isComplete: !checked});
  // taskChanged();
}

function taskRemoved(snapshot){
  //console.log(snapshot.val());
  var key = snapshot.key();
  $('tr[data-key="'+key+'"]').remove();

}

function deleteTask(){
  var key = $(this).closest('tr').data('key');
  var task = tasks.child(key);
  task.remove();
}

function taskAdded(snapshot){
  var task = snapshot.val();
  console.log(snapshot.val());
  var key = snapshot.key();
  console.log(key);
  var checkChecked; //checks whether the task is completed or not by checking the box
  if(task.isComplete === true){
    checkChecked = 'checked>';
  } else {
    checkChecked = 'unchecked>';
  }
  var tr = '<tr class="'+ checkChecked +'"data-key="' + key + '"><td><button class="delete">&times;</button></td><td><input type="checkbox" ' + checkChecked + '</td><td>' + task.title + '</td><td>' + moment(task.dueDate).format('YYYY-MM-DD') + '</td><td>' + task.priority + '</td><td>' + task.isComplete + '</td><td>' + moment(task.createdAt).format('YYYY-MM-DD') + '</td></tr>';
  $('#todos > tbody').append(tr);

}

function createTask(){
  var title = $('#title').val();
  var dueDate = $('#dueDate').val();
  dueDate = new Date(dueDate);
  dueDate = dueDate.getTime();
  var priority = $('#priority').val();
  var isComplete = false;
  var createdAt = new Date();
  createdAt = Firebase.ServerValue.TIMESTAMP;

  var task = {
    title: title,
    dueDate: dueDate,
    priority: priority,
    isComplete: isComplete,
    createdAt: createdAt
  }; //the thing on the left is the key, on the right is variable

  console.log(task);

  tasks.push(task);

}

function userChanged(snapshot){
  var name = snapshot.val();
  //console.log(snapshot.val());
  $('h1').text('ToDo: ' + name);
}

function setName(){
  var name = $('#name').val();
  $('#name').val('');
  user.set(name); //.set() changes the value
}
