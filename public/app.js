function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`
}

// initial page load render
let defaultHTML = items.map(item => {
  return itemTemplate(item)
}).join('')
document.getElementById('item-list').insertAdjacentHTML('beforeend', defaultHTML)
// Create feature
let inputText = document.getElementById('input-text')

document.getElementById('todo-form').addEventListener('submit', e => {
  e.preventDefault()
  axios.post('/create-item', {text: inputText.value})
    .then(res => {
      // create the HTML for a new item
      document.getElementById('item-list').insertAdjacentHTML('beforeend', itemTemplate(res.data))
      inputText.value = ''
      inputText.focus()
    })
    .catch(err => {
      console.error('falied to delete item ', err) 
    })
})

document.addEventListener('click', e => {
  // delete feature
  if(e.target.classList.contains('delete-me')) {
    if(confirm('Are you sure?')){
      axios.post('/delete-item', {id: e.target.getAttribute('data-id')})
      .then(res => {
        e.target.parentElement.parentElement.remove()
      })
      .catch(err => {
        console.error('falied to delete item ', err) 
      })
    }
  }

  // update feature
  if(e.target.classList.contains('edit-me')) {
    let itemText = e.target.parentElement.parentElement.querySelector('.item-text'),
        userInput = prompt('Please entern your desired text', itemText.innerHTML);
    if(userInput) {
      axios.post('/update-item', {text: userInput, id: e.target.getAttribute('data-id')})
      .then(res => {
        itemText.innerHTML = userInput;
      })
      .catch(err => {
        console.error('falied to update item ', err)
      })
    }
    
  }
})