import { GithubUser } from "./GithubUser.js"

//classe com a lógica dos dados e sua estrutura

export class Favorites {
  constructor (root) {
    this.root = document.querySelector(root)
    this.load()

  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    

  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)


      if(userExists) {
        throw new Error('Usuário já favoritado!')
      }
        
      const githubUser = await GithubUser.search(username)

      if(githubUser.login === undefined) {
        throw new Error('Usuário não encontrado!')
      } 
      
      this.entries = [githubUser, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }

  }

  delete(user) {
    this.entries = this.entries.filter(entry => entry.login !== user.login)
    
    this.update()

    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    
    this.tbody = this.root.querySelector('table tbody')
    this.tableEmpty = this.root.querySelector('.table-empty')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.favButton')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.input-wrapper input')

      this.add(value)
    }
  }


  update() {
    this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a p').textContent = `${user.name}`
      row.querySelector('.user a span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = `${user.public_repos}`
      row.querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('.remove').addEventListener('click', () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk) {
          this.delete(user)
        }
        
      })

      this.tbody.append(row)
    })
    
    if(this.entries.length != 0) {
      this.tableEmpty.classList.add('hide')
    } if(this.entries.length == 0) {
      this.tableEmpty.classList.remove('hide')
    }
  
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/maykbrito.png" alt="">
      <a href="https://github.com/maykbrito" target="_blank">
        <p>Mayk Brito</p>
        <span>/maykbrito</span>
      </a>
    </td>
    <td class="repositories">
      123
    </td>
    <td class="followers">
      4561
    </td>
    <td>
      <button class="remove">Remover</button>
    </td>
    `
    return tr
  }

  removeAllTr() {
    

    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }

}
