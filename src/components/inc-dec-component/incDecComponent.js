import { LitElement, html } from 'lit';
import reset from '@/styles/reset.js';
import incDecComponentStyle from '@/components/inc-dec-component/incDecComponentStyle.js';

class IncDecBtn extends LitElement {
    static styles = [reset, incDecComponentStyle];

    static properties = {
        id: { type: String, attribute: 'id' },
        idValue: { type: Number },
        items: { type: Number },
        cartItems: { type: Object },
        isCartPage: { type: Boolean, attribute: 'cartpage', reflect: true },
    };

    connectedCallback() {
        super.connectedCallback();
        console.log(this.isCartPage);
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) ?? {};
        this.isCartPage ? (this.idValue = this.cartItems[`${this.id}`]) : (this.idValue = 0);
        this.items = this.idValue ?? 0;
    }

    // 매개변수로 add를 받았다면 localStorage에 itemQuantity를 1증가 혹은 감소 시키는 함수
    // 현재 increase와 decrease에 겹치는 부분을 외부 함수로 따로 분리
    // TOPIC : 현재 매개변수로는 add만을 인식하고 그에 따라 동작하는데 이를 if else문 혹은 swich문으로 작성하는게 좀 더 가독성이 좋을까?
    calcQuantity(calc) {
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) ?? {};
        console.log(this.isCartPage);
        if (calc === 'add') {
            console.log(this.cartItems);
            this.items += 1;
            this.cartItems[`${this.id}`] = this.items ?? 0;
        } else {
            this.items -= 1;
            this.cartItems[`${this.id}`] = this.items ?? 0;
        }
        this.isCartPage ? localStorage.setItem('cartItems', JSON.stringify(this.cartItems)) : localStorage.setItem(`${this.id}`, this.items);
    }

    // 1증가 시키고 rerender시키는 함수
    // TOPIC : rerender시키는게 성능적으로 괜찮을까?
    handleIncreaseItem() {
        this.calcQuantity('add');
    }

    // 1감소 시키고 rerender시키는 함수
    handleDecreaseItem() {
        this.calcQuantity('minus');
    }

    render() {
        return html`
            <div class="amount-container">
                <!--만약 제품 수량이 1 미만이라면 - 버튼 비활성화-->
                <button
                    type="button"
                    class="minus-button"
                    @click=${this.handleDecreaseItem}
                    ?disabled=${this.items < 1}
                    aria-label="제품 수량 감소 버튼"
                >
                    <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 0V2H0V0H10Z" fill="currentColor" />
                    </svg>
                </button>
                <span class="sr-only">제품 수량</span>
                <span class="item-amount">${this.items}</span>
                <button type="button" class="plus-button" @click=${this.handleIncreaseItem} aria-label="제품 수량 증가 버튼">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 0V4H10V6H6V10H4V6H0V4H4V0H6Z" fill="currentColor" />
                    </svg>
                </button>
            </div>
        `;
    }
}

customElements.define('inc-dec-btn', IncDecBtn);
