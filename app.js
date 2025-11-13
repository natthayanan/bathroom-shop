// ใส่ config จริงหลังสร้าง Firebase (ตอนนี้ยังเป็น placeholder)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ตะกร้าแบบง่าย
const cart = [];
const cartList = document.getElementById('cartList');
const totalEl = document.getElementById('grandTotal');
function renderCart(){
  cartList.innerHTML=''; let t=0;
  cart.forEach((it,i)=>{ t+=it.price;
    const li=document.createElement('li');
    li.textContent=`${i+1}. ${it.name} — ฿${it.price}`;
    cartList.appendChild(li);
  });
  totalEl.textContent=t.toLocaleString();
}
document.querySelectorAll('.add-btn').forEach(b=>{
  b.addEventListener('click', ()=>{ cart.push({name:b.dataset.name, price:+b.dataset.price}); renderCart(); });
});

// ส่งคำสั่งซื้อไป Firestore (collection: orders)
const f=document.getElementById('orderForm'); const s=document.getElementById('status');
f.addEventListener('submit', async (e)=>{
  e.preventDefault(); s.textContent='กำลังส่ง...';
  const data={
    customerName:f.customerName.value.trim(),
    phone:f.phone.value.trim(),
    address:f.address.value.trim(),
    items:cart,
    total:cart.reduce((x,i)=>x+i.price,0),
    createdAt:new Date().toISOString()
  };
  try{ await db.collection('orders').add(data);
       s.textContent='บันทึกสำเร็จ ✔'; f.reset(); cart.length=0; renderCart();
  }catch(err){ console.error(err); s.textContent='บันทึกล้มเหลว: ตรวจ config Firebase'; }
});

