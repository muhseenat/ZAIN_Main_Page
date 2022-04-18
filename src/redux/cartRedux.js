import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
     
     
      const product = state.products.find(
        (i) => i._id == action.payload._id
      );
      
      if (product) {
        product.quantity += action.payload.quantity;

      } else {
        state.products.push(action.payload);
        state.quantity += 1;
      }

    },
    removeProduct: (state, action) => {
  
     
      if (state.quantity > 0) {
           state.quantity -= 1;
         }
  
    },
    clearProduct:(state,action)=>{
      state.quantity=0
      state.products=[]
    }
  },
});

export const { addProduct, removeProduct, clearProduct } = cartSlice.actions;
export default cartSlice.reducer;
