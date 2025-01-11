const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const dateSpan = document.querySelector('#date-span');

const isOpen = checkRestaurantOpen();

cart = [];

//abrir o modal do carrinho
cartBtn.addEventListener('click', function () {
    updateCartModal();
    cartModal.classList.remove('hidden');
    cartModal.classList.add('flex');
})

//fechar modal quando clicar no botão "fechar"
closeModalBtn.addEventListener('click', function () {
    cartModal.classList.remove('flex');
    cartModal.classList.add('hidden')
})

//fechar modal quando clicar fora do modal
cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.classList.remove('flex');
        cartModal.classList.add('hidden');
    }
})


menu.addEventListener('click', function (event) {
    let parentButton = event.target.closest('.add-to-cart-btn');

    const name = parentButton.getAttribute('data-name');
    const price = parentButton.getAttribute('data-price');

    addToCart(name, price);

    Toastify({
        text: `Item adicionado ao carrinho!`,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#87CEEB",
          borderRadius: "40px"
        },
      }).showToast();
});

//função de adicionar item ao carrinho

function addToCart(name, price) {

    const existentItem = cart.find(item => item.name === name);

    if (existentItem) {
        existentItem.quantity += 1
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }

    updateCartModal();
}

//função para atualizar o carrinho

function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
             <p class="font-medium">${item.name}</p>
             <p>Quantidade: ${item.quantity}</p>
             <p class="font-medium mb-2">${(item.price * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>

            <button class="remove-cart-item-btn" data-name="${item.name}">
            Remover
            </button>
        </div>
        `

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = sumTotalCart(cart);
    cartCounter.textContent = sumTotalQuantity(cart);
}

function sumTotalCart(arr) {
    let totalCartValue = 0;

    arr.forEach(item => {
        totalCartValue += (item.quantity * item.price)
    })

    return totalCartValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function sumTotalQuantity(arr) {
    let totalQuantity = 0;

    arr.forEach(item => {
        totalQuantity += item.quantity;
    });

    return totalQuantity;
}

cartItemsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-cart-item-btn')) {
        const name = event.target.getAttribute('data-name');
        removeCartItem(name);
    }
});


function removeCartItem(name) {
    const i = cart.findIndex(item => item.name === name);

    if (i !== -1) {
        const item = cart[i];

        if (item.quantity > 1) {
            item.quantity--;
            updateCartModal();
        } else {
            cart.splice(i, 1);
            updateCartModal();
        }
    }
};

addressInput.addEventListener('input', function (event) {
    let inputValue = event.target.value;

    if (inputValue != '') {
        addressWarn.classList.add('hidden');
        addressInput.classList.remove('border-red-500');
    }

});

checkoutBtn.addEventListener('click', function () {
    // if(!isOpen) {

    //     Toastify({
    //         text: "Ops, o restaurante está fechado!",
    //         duration: 3000,
    //         close: true,
    //         gravity: "top", // `top` or `bottom`
    //         position: "right", // `left`, `center` or `right`
    //         stopOnFocus: true, // Prevents dismissing of toast on hover
    //         style: {
    //           background: "#ef4444",
    //         },
    //       }).showToast();

    //     return;
    // }

    if (cart.length === 0) return;

    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden');
        addressInput.classList.add('border-red-500');
        return;
    }

    //enviar pedido para a API do whatsWeb;

    const cartItems = cart.map((item) => {
        let subTotal = (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        return (
            `${item.quantity}x ${item.name} | ${subTotal} \n`
        )
    }).join("");

    const message = encodeURIComponent(`${cartItems}\n*Total:* ${sumTotalCart(cart)}\n*Endereço:* ${addressInput.value}`);
    const phone = "53984530184";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
});

function checkRestaurantOpen() {
    const date = new Date();
    const hour = date.getHours();

    return hour >= 18 && hour <= 22; //true
}

if (isOpen) {
    dateSpan.classList.remove('bg-red-500');
    dateSpan.classList.add('bg-green-500');
} else {
    dateSpan.classList.remove('bg-green-500');
    dateSpan.classList.add('bg-red-500');
}
