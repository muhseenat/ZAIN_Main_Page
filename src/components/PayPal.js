import React ,{useEffect, useRef} from 'react'

function PayPal({amount}) {

    const paypal =useRef()
    
  useEffect(()=>{
    window.paypal
    .Buttons({
      createOrder: (data, actions,err) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: "Thank You for Shopping",
              amount: {
                currency_code: "INR",
                value: amount,
              },
            },
          ],
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
      },
      onError: (err) => {
        console.error(err);
      },
    })
    .render(paypal.current);
  
  },[]);

  return (
    <div>

        <div ref={paypal}></div>
    </div>
  )
}

export default PayPal