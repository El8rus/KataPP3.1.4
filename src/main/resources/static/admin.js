const url = "http://localhost:8080/admin/api/users/"
const userUrl = 'http://localhost:8080/api/user/'
const urlForRoles = '/admin/api/users/roles'
const urlForHeader = '/admin/api/users/header'
const info = document.querySelector('#users-list')
const tabTrigger = new bootstrap.Tab(document.getElementById('nav-home-tab'))

let users = [];

const listUsers = async (users) => {
    const response = await fetch(url);

    if (response.ok) {
        let json = await response.json()
            .then(data => fillUserRow(data));
    } else {
        alert("Error: " + response.status);
    }

    function fillUserRow(users) {
        output = ''
        users.forEach(user => {
            output += ` 
              <tr> 
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.username}</td>
                    <td>${user.roles.map((role) => role.role.substring(5))}</td>
              <td> 
                   <button type="button" data-action="edit" class="btn btn-info text-white"
                        data-toggle="modal" data-target="modal" id="edit-user" data-id="${user.id}">Edit</button>
               </td> 
               <td> 
                   <button type="button" class="btn btn-danger" id="delete-user" data-action="delete"
                       data-id="${user.id}" data-target="modal">Delete</button>
                    </td> 
              </tr>`
        })
        info.innerHTML = output;
    }
}

const updateUser = (user) => {
    const index = users.findIndex(x => x.id === user.id);
    users[index] = user;
    listUsers(users);
}

function getAllRoles(target) {
    fetch(urlForRoles)
        .then(response => response.json())
        .then(roles => {
            let optionsRoles = ''
            roles.forEach(role => {
                optionsRoles += `<option value='${role.id}'>${role.role.substring(5)}</option>`
            })
            target.innerHTML = optionsRoles
        })
}

let roleArray = (options) => {
    let array = []
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            let role = {id: options[i].value}
            array.push(role)
        }
    }
    return array;
}

function getAuthentication() {
    fetch(urlForHeader)
        .then(response => response.json())
        .then(user => {
            const text = user.username + ' with roles: ' + user.roles.map(r => r.role.substring(5))
            document.getElementById('current_authorised_user-data').innerHTML = text
        })
}

getAuthentication()


// User info

let loggedInUser = document.querySelector('#userInfo')

fetch(userUrl)
    .then(res => res.json())
    .then(data => {
        loggedInUser.innerHTML = `
                                <td>${data.id}</td>
                                <td>${data.name}</td>
                                <td>${data.lastName}</td>
                                <td>${data.age}</td>
                                <td>${data.username}</td>
                                <td>${data.roles.map((role) => role.role.substring(5))}</td>
                                `
    })


// Get all users

fetch(url, {mode: 'cors'})
    .then(res => res.json())
    .then(data => {
        users = data;
        listUsers(data)
    })


//Add user

const newUserForm = document.getElementById('newUserForm')

getAllRoles(document.getElementById('addRole'))
newUserForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(newUserForm)
    const newUser = {
        roles: []
    }

    formData.forEach((value, key) => {
        newUser[key] = value
    })

    newUser.roles = roleArray(document.querySelector('#addRole'))

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            'Referer': null
        },
        body: JSON.stringify(newUser)
    })
        .then(data => updateUser(data))
        .then(() => newUserForm.reset())
        .catch((e) => console.error(e))

    tabTrigger.show()

})

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}


//Edit user

on(document, 'click', '#edit-user', e => {
    const userInfo = e.target.parentNode.parentNode
    document.getElementById('edit-Id').value = userInfo.children[0].innerHTML
    document.getElementById('edit-name').value = userInfo.children[1].innerHTML
    document.getElementById('edit-lastName').value = userInfo.children[2].innerHTML
    document.getElementById('edit-age').value = userInfo.children[3].innerHTML
    document.getElementById('edit-username').value = userInfo.children[4].innerHTML
    document.getElementById('edit-password').value = ''
    document.getElementById('editRole').value = getAllRoles(document.getElementById('editRole'))

    let userRoles = userInfo.children[5].innerHTML.split(",")
    fetch(urlForRoles)
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                for (let i = 0; i < userRoles.length; i++) {
                    if (role.role.substring(5) == userRoles[i]) {
                        document.getElementById('editRole').options[role.id - 1].selected = true
                    }
                }
            })
        })

    $("#edit-user-modal").modal("show")


})

const editUserForm = document.getElementById('editForm')

editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(editUserForm);
    const updUser = {
        roles: []
    };

    formData.forEach((value, key) => {
        updUser[key] = value;
    });
    updUser.roles = roleArray(document.querySelector('#editRole'));

    fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            'Referer': null
        },
        body: JSON.stringify(updUser)
    })
        .then(data => updateUser(data))
        .catch((e) => console.error(e))

    $("#edit-user-modal").modal("hide")
})


// Delete user

const removeUser = (id) => {
    users = users.filter(user => user.id !== id);
    listUsers(users);
}

let currentUserId = null;


on(document, 'click', '#delete-user', e => {
    const userInfo = e.target.parentNode.parentNode

    currentUserId = userInfo.children[0].innerHTML

    document.getElementById('delete-Id').value = userInfo.children[0].innerHTML
    document.getElementById('delete-name').value = userInfo.children[1].innerHTML
    document.getElementById('delete-lastName').value = userInfo.children[2].innerHTML
    document.getElementById('delete-age').value = userInfo.children[3].innerHTML
    document.getElementById('delete-username').value = userInfo.children[4].innerHTML
    document.getElementById('deleteRole').value = getAllRoles(document.getElementById('deleteRole'))
    let userRoles = userInfo.children[5].innerHTML.split(",")
    fetch(urlForRoles)
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                for (let i = 0; i < userRoles.length; i++) {
                    if (role.role.substring(5) == userRoles[i]) {
                        document.getElementById('deleteRole').options[role.id - 1].selected = true
                    }
                }
            })
        })
    $("#delete-user-modal").modal("show")
})

const deleteUserForm = document.querySelector('#deleteForm')
deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fetch(url + currentUserId, {
        method: 'DELETE'
    })
        .then()
        .then(() => {
            removeUser(currentUserId);
            deleteUserForm.removeEventListener('submit', () => {
            });
            $("#delete-user-modal").modal("hide")
        })
})