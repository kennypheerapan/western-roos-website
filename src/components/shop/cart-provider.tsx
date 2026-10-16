'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CART_KEY, serializeCart, MAX_QUANTITY, type CartAction, type CartLine, type Product } from '@/lib/shop/domain';
import { storedSelections, cartIssue } from '@/lib/shop/cart-current';
const CartContext = createContext<{lines:CartLine[]; products:Product[]; catalogAvailable:boolean|null; ready:boolean; storageError:boolean; dispatch:(action:CartAction)=>void} | null>(null);
export function CartProvider({children}: {children:React.ReactNode}) {
  const [state, setState] = useState<{lines:CartLine[]; ready:boolean; storageError:boolean}>({lines:[], ready:false, storageError:false});
  const pathname=usePathname();
  const [catalog,setCatalog]=useState<{products:Product[];available:boolean|null;path:string}>({products:[],available:null,path:''});
  useEffect(()=>{
    if(!pathname.startsWith('/shop')&&pathname!=='/checkout')return;
    const controller=new AbortController();
    fetch('/api/catalog',{cache:'no-store',signal:controller.signal}).then(async r=>{if(!r.ok)throw Error();const value=await r.json();if(!value.available||!Array.isArray(value.products))throw Error();setCatalog({products:value.products,available:true,path:pathname});}).catch(()=>{if(!controller.signal.aborted)setCatalog({products:[],available:false,path:pathname});});
    return ()=>controller.abort();
  },[pathname]);
  useEffect(() => {
    function restore() {
      try { setState({lines:storedSelections(localStorage.getItem(CART_KEY)),ready:true,storageError:false}); }
      catch { setState(s=>({...s,ready:true,storageError:true})); }
    }
    restore();
    const sync = (e:StorageEvent) => { if(e.key === CART_KEY || e.key === null) restore(); };
    window.addEventListener('storage',sync);
    return () => window.removeEventListener('storage',sync);
  }, []);
  function dispatch(action:CartAction) {
    if (!state.ready) return;
    let lines=state.lines;
    if(action.type==='clear')lines=[];
    else if(action.type==='remove')lines=lines.filter(l=>l.productId!==action.productId||l.offerId!==action.offerId);
    else if(action.type==='quantity'){
      if(!Number.isInteger(action.quantity)||action.quantity<1||action.quantity>MAX_QUANTITY)return;
      lines=lines.map(l=>l.productId===action.productId&&l.offerId===action.offerId?{...l,quantity:action.quantity}:l);
    }else{
      const existing=lines.find(l=>l.productId===action.line.productId&&l.offerId===action.line.offerId);
      const next={...action.line,quantity:action.line.quantity+(existing?.quantity??0)};
      if(catalog.path!==pathname||!catalog.available||!Number.isInteger(next.quantity)||next.quantity<1||next.quantity>MAX_QUANTITY||cartIssue(next,catalog.products))return;
      lines=existing?lines.map(l=>l===existing?next:l):[...lines,next];
    }
    let storageError = false;
    try { localStorage.setItem(CART_KEY,serializeCart(lines)); } catch { storageError = true; }
    setState({lines,ready:true,storageError});
  }
  return <CartContext.Provider value={{...state,products:catalog.products,catalogAvailable:catalog.path===pathname?catalog.available:null,dispatch}}>{children}</CartContext.Provider>;
}
export function useCart() {
  const cart = useContext(CartContext);
  if(!cart) throw new Error('CartProvider is required');
  return cart;
}
