
// Post Memo
document.querySelector("#post-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    let content = e.currentTarget.content.value

    let formData = new FormData(e.currentTarget)


    if (formData.get("photo").size == 0) {
        Swal.fire({
            html: '<div><img src="https://na.cx/i/NuQ1M4O.gif" /></div>',
            title: "冇圖學咩人開post啊",
            icon: "question"
        });
        return
    }

    let res = await fetch("/memo", {
        method: "POST",
        body: formData
    })

    // create new memo successful
    if (res.ok) {
        let response = await res.json()
        let target = document.querySelector(".memo-area")

        target.innerHTML += `        
            <div class="memo" id="memo-${response.data.id}">
                <div class="icon-container top">
                <i class="fa-solid fa-trash" onclick="deleteMemoById(${response.id})"></i>
                </div>
                <div class="icon-container bottom" onclick="toggleEdit(${response.data.id},'${content}')">
                <i class="fa-solid fa-pen-to-square"></i>
                </div>
            ${content}
    
            ${response.data.photo ? `<img src="${response.data.photo}" class="memo-image" />` : ""
            }
            </div>`
    }

})

// User Login
document.querySelector("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    let email = document.querySelector("#emailInput").value
    let password = document.querySelector("#passwordInput").value

    let res = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    if (res.status == 200) {

        Swal.fire({
            title: "Congrats",
            text: "You remember your username and password. Proceed to home page?",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes, Let's go!"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload()
            }
        });

    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Username or password is incorrect!",
        });
    }

})


async function deleteMemoById(id) {
    let res = await fetch(`/memo?id=${id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        window.location.reload()
    } else {
        Swal.fire("Delete Failed!");
    }

}

function toggleEdit(id, content) {
    document.querySelector(`#memo-${id}`).innerHTML = `
    <div class="icon-container top">
      <i class="fa-solid fa-trash"></i>
    </div>
    <div class="icon-container bottom">
      <i class="fa-solid fa-pen-to-square"></i>
    </div>
    <form onsubmit="editMemoById(event,${id})">
    <textarea class="memo-edit" name="content">${content}</textarea>

    <input type="file" name="photo"/>
    <button type=submit>confirm change</button>
    <button onclick="window.location.reload()">cancel</button>
    </form>
  `
}


async function editMemoById(event, id) {
    event.preventDefault()

    let formData = new FormData(event.currentTarget)

    formData.append('id', id)

    if (formData.get("photo").size == 0) {
        Swal.fire({
            html: '<div><img style="width:90%" src="https://i.lih.kg/thumbnail?u=https%3A%2F%2Fna.cx%2Fi%2FbykJuTU.jpg&h=4a53a359&s=540" /></div>',
            title: "圖呢",
            icon: "question"
        });
        return
    }

    let res = await fetch("/memo", {
        method: "PUT",
        body: formData
    })

    if (res.ok) {
        window.location.reload()
    } else {
        Swal.fire("Edit Failed!");
    }

}


async function getMemos() {

    let username = await getUsername()
    let res = await fetch("/memo/")

    console.log({username})
    let response = await res.json()

    if (res.ok) {
        let target = document.querySelector(".memo-area")
        for (let memo of response.data.memos) {

            target.innerHTML += `        
            <div class="memo" id="memo-${memo.memo_id}">
               ${username ? ` <div class="icon-container top" onclick="deleteMemoById(${memo.memo_id})">
               <i class="fa-solid fa-trash" ></i>
               </div>
               <div class="icon-container bottom" onclick="toggleEdit(${memo.memo_id},'${memo.content}')">
               <i class="fa-solid fa-pen-to-square" ></i>
               </div>
               <div class="icon-container top left" onclick="toggleLike(${memo.memo_id})">
               <i class="fa-${memo.liked ? 'solid' : 'regular'} fa-heart"></i>
               </div>
               `: ""}

            ${memo.content}
    
            ${memo.image ? `<img src="${memo.image}" class="memo-image" />` : ""
                }
            </div>`

        }
    }

    if (username) {
        document.querySelector("#login-form > .input-group").innerHTML = ` <h3>連儂管理員專用</h3>
             
        <h4 style="color:white">Welcome back admin ${username}</h4>
        <div class="button-container">
          <button id="logout-button">登出</button>
        </div>`

        document.querySelector("#logout-button").addEventListener("click", async (e) => {
            e.preventDefault()

            let res = await fetch("/auth/logout")

            if (res.ok) {
                window.location.reload()
            } else {
                Swal.fire("Logout Failed!");
            }
        })
    }

}

async function getUsername() {
    let res = await fetch("/auth/username")

    if (res.ok) {
        let response = await res.json()

        console.log(response.data.username)
        return response.data.username
    } else {
        console.log("Not logged In")
        return false
    }
}


async function toggleLike(id) {
    console.log(id)
    let res = await fetch(`/memo/like?id=${id}`, {
        method: "PUT"
    })

    if (res.ok) {
        window.location.reload()
    }
}


getMemos()