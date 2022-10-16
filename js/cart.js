const cart = () => {
    const cartBtn = document.querySelector('.button-cart')
    const cart = document.getElementById('modal-cart')
    const closeBtn = cart.querySelector('.modal-close')
    const goodsContainer = document.querySelector('.long-goods-list')
    const cartTable = document.querySelector('.cart-table__goods')
    const modalForm = document.querySelector('.modal-form')

    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart')) // получаем 

        const newCart = cart.filter(good => {
            return good.id !== id
        })

        localStorage.setItem('cart', JSON.stringify(newCart)) // возвращаем
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }
    const RemoveCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map(good => {
            if (good.id === id) {
                good.count--

            }
            return good
        })
        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }
    const AddCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map(good => {
            if (good.id === id) {
                good.count++
                console.log(good.count);
            }
            return good
        })

        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }
    console.log(cartTable);
    // cartBtn.onclick 
    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'))
        const clickedGood = goods.find(good => good.id === id) // ищем в базе данных элемент с полученным id
        const cart = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []

        if (cart.some(good => good.id === clickedGood.id)) { // если какие-то элементы уже лежат в корзине то увеличиваем


            cart.map(good => {
                if (good.id === clickedGood.id) {
                    good.count++
                    console.log(good.count);
                }
                return good
            })
        }
        else {
            console.log('добавить товар');
            clickedGood.count = 1

            cart.push(clickedGood)  //если при нажатии на товар, его еще нет в корзине, то возвращаем пустой массив а после закидываем туда элемент
        }
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    // console.dir(cartBtn);
    const renderCartGoods = (goods) => {
        cartTable.innerHTML = ''

        goods.forEach(good => {
            const tr = document.createElement('tr') // создаем элемент
            tr.innerHTML = ` 
           
						<td>${good.name}</td>
						<td>${good.price}$</td>
						<td><button class="cart-btn-minus">-</button></td>
						<td>${good.count}</td>
						<td><button class="cart-btn-plus">+</button></td>
						<td>${+good.price * +good.count}$</td> 
						<td><button class="cart-btn-delete">x</button></td>
					
            ` // задаем html Элементу
            cartTable.append(tr) // помещаем элементы в родителя

            tr.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart-btn-minus') && (good.count !== 0)) {
                    RemoveCartItem(good.id)
                    console.dir(good);
                } else if (e.target.classList.contains('cart-btn-plus')) {
                    AddCartItem(good.id)

                } else if (e.target.classList.contains('cart-btn-delete')) {
                    deleteCartItem(good.id)
                }
            })
        })
    }
    const sendForm = () => {
        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cartArray,
                name: '',
                phone: ''
            })
        }).then(() => {
            cart.style.display = '';
        })
    }

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault()
        sendForm()
    })
    cartBtn.addEventListener('click', () => {

        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []

        renderCartGoods(cartArray)



        cart.style.display = 'flex';


    })
    closeBtn.addEventListener('click', () => {
        cart.style.display = '';
    })
    cart.addEventListener('click', (event) => { // закрытие при клике не по форме
        if (!event.target.closest('.modal') && event.target.classList.contains('overlay')) {
            cart.style.display = ''
        }
    })
    window.addEventListener('keydown', (e) => { // закрытие при клике на эскейп
        if (e.key === 'Escape') {
            cart.style.display = ''
        }
    })
    if (goodsContainer) { // если гудконтейнер существует, то
        goodsContainer.addEventListener('click', (event) => {

            if (event.target.closest('.add-to-cart')) { // если элемент, с которым было совершенно действие имеет у родителей(или у себя) класс , то 

                const buttonToCart = event.target.closest('.add-to-cart')//сохраняем элемент с которым было совершено действие
                const goodId = buttonToCart.dataset.id // получаем его id

                addToCart(goodId) // записываем логику в отдельную функцию и вызываем ее


            }
        })
    }
}
cart();