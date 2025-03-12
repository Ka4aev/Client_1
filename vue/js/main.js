let eventBus = new Vue();

Vue.component('product-review', {
    props: {
        product: {
            type: String,
            required: true
        },
        selectedColor: {
            type: String,
            required: true
        }
    },
    template: `
<form class="review-form" @submit.prevent="onSubmit">

    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="YOUR NAME (VANYA)">
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
    </p>

    <p>
        <label for="review">Review:</label>
        <textarea id="review" placeholder="REALLY GOOD SOCKS" v-model="review"></textarea>
        <span v-if="errors.review" class="error-message">{{ errors.review }}</span>
    </p>

    <p>
        <label for="rating">Rating (1-5):</label>
        <select id="rating" v-model.number="rating">
            <option disabled value="">Select Rating</option>
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
        <span v-if="errors.rating" class="error-message">{{ errors.rating }}</span>
    </p>

    <p>
        <input type="submit" value="Submit"> 
    </p>

</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: {}
        };
    },
    methods: {
        onSubmit() {
            this.errors = {};

            if (!this.name) this.errors.name = "Name is required.";
            if (!this.review) this.errors.review = "Review is required.";
            if (!this.rating) this.errors.rating = "Rating is required.";

            if (Object.keys(this.errors).length === 0) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    product: this.product,
                    color: this.selectedColor
                };
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
            }
        }
    }
});


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    },
    template: `
   <div class="product">
       <div v-if="isOpen" class="modal" @click.self="isOpen = false">
           <div class="modal-info">
               <h2>{{ product }}</h2>
               <ul>
                   <li v-for="detail in details">{{ detail }}</li>
               </ul>
      
               <h3>
               Color:  
                   <p>{{selectedColor}}</p>
               </h3>
           </div>
       </div>

       <div class="product-image">
           <img :src="image" :alt="altText"/>
       </div>

       <div class="product-info">
           <h1>{{ title }}</h1>
           <p v-if="inStock">In stock</p>
           <p v-else>Out of Stock</p>
           
           <div>   
               <ul>
                 <span class="tab"
                       :class="{ activeTab: selectedTab === tab }"
                       v-for="(tab, index) in tabs"
                       @click="selectedTab = tab"
                 >{{ tab }}</span>
               </ul>
               
               <ul v-show="selectedTab === 'Details'">
                    <li v-for="detail in details">{{ detail }}</li>
               </ul>
               <p v-show="selectedTab === 'Shipping'">Shipping: {{ shipping }}</p>
            </div>

           <div
               class="color-box"
               v-for="(variant, index) in variants"
               :key="variant.variantId"
               :style="{ backgroundColor: variant.variantColor }"
               @mouseover="updateProduct(index)"
           ></div>
          
           <button
               @click="addToCart"
               :disabled="!inStock"
               :class="{ disabledButton: !inStock }"
           >
               Add to cart
           </button>    
           <product-tabs :product="product" :selectedColor="selectedColor" :reviews="reviews"></product-tabs>
       </div>           
   </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            isOpen: false,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 1
                }
            ],
            reviews: [],
            tabs: ['Details', 'Shipping'],
            selectedTab: 'Details'
        };
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            this.isOpen = true;
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        shipping() {
            return this.premium ? "Free" : "2.99";
        },
        selectedColor() {
            return this.variants[this.selectedVariant].variantColor;
        }
    }
});


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        product: {
            type: String,
            required: true
        },
        selectedColor: {
            type: String,
            required: true
        }
    },

    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
               <h2>{{ product }} - {{ review.color }}</h2>
               <p>{{ review.name }}</p>
               <p>Rating: {{ review.rating }}</p>
               <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
            <product-review :product="product" :selectedColor="selectedColor"></product-review>
       </div>
     </div>
`,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
});


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        }
    }
});
